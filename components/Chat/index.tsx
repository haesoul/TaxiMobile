import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { connect, ConnectedProps } from 'react-redux'

import * as API from '../../API'
import { IRootState } from '../../state'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import { userSelectors } from '../../state/user'
import { IUser } from '../../types/types'

import { SafeAreaView } from 'react-native-safe-area-context'

enum EMessageType {
  MainUserMessage,
  AnotherUserMessage,
  Action,
}

interface IMessage {
  text: string
  from?: string
  type?: EMessageType
}

interface ISocketData {
  action: string
  event?: string
  arg?: string
  msg?: string
  history?: {
    action?: string
    to: string
    from: string
    msg: string
  }[]
  from?: string
}

interface IFormValues {
  message: string
}

const mapStateToProps = (state: IRootState) => ({
  user: userSelectors.user(state),
  activeChat: modalsSelectors.activeChat(state),
})

const mapDispatchToProps = {
  setActiveChat: modalsActionCreators.setActiveChat,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const host = 'chat.itest24.com'
const port = 7007

const Chat: React.FC<PropsFromRedux> = ({ user, activeChat, setActiveChat }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [anotherUser, setAnotherUser] = useState<IUser | null>(null)

  const scrollRef = useRef<ScrollView | null>(null)
  const socketRef = useRef<WebSocket | null>(null)

  const { control, handleSubmit, reset } = useForm<IFormValues>({ defaultValues: { message: '' } })

  if (!activeChat) return null

  const [from, to] = activeChat.split(';')
  const [anotherUserID, order] = (to || '').split('_')

  useEffect(() => {
    let mounted = true

    if (anotherUserID) {
      API.getUser(anotherUserID)
        .then((u: IUser | null) => {
          if (mounted && u) setAnotherUser(u)
        })
        .catch((err: any) => console.error('Failed to fetch other user', err))
    }
    

    try {
      const ws = new WebSocket(`wss://${host}:${port}`)
      socketRef.current = ws
      setSocket(ws)

      ws.onopen = () => {
        ws.send(JSON.stringify({ from, to, action: 'start' }))
      }

      ws.onmessage = e => {
        try {
          const data: ISocketData = JSON.parse(e.data)
          const { action, event, arg, msg, from: dataFrom, history } = data

          switch (action) {
            case 'notify': {
              const message: IMessage = {
                type: EMessageType.Action,
                from: arg || from,
                text: '',
              }
              switch (event) {
                case 'joined':
                case 'you-joined':
                  message.text = 'joined the conversation'
                  break
                case 'left':
                case 'you-left':
                  message.text = 'left the conversation'
                  break
                default:
                  console.error('Wrong chat event:', event)
                  message.text = event || 'unknown event'
              }

              setMessages(prev => [...prev, message])
              break
            }

            case 'send': {
              const message: IMessage = {
                type: from === dataFrom ? EMessageType.MainUserMessage : EMessageType.AnotherUserMessage,
                from: dataFrom,
                text: (msg as string) || '',
              }

              setMessages(prev => [...prev, message])
              break
            }

            case 'history': {
              if (history && Array.isArray(history)) {
                const mapped = history.map(item => ({
                  type: from === item.from ? EMessageType.MainUserMessage : EMessageType.AnotherUserMessage,
                  from: item.from,
                  text: item.msg,
                }))
                setMessages(mapped)
              }
              break
            }

            default:
              console.error('Wrong chat action:', action)
          }
        } catch (err) {
          console.error('Failed to parse socket message', err)
        }
      }

      ws.onerror = err => {
        console.error('Socket error', err)
      }

      ws.onclose = () => {}
    } catch (err) {
      console.error('Failed to open websocket', err)
    }

    return () => {
      mounted = false
      if (socketRef.current) {
        try { socketRef.current.close() } catch (e) {}
      }
      socketRef.current = null
      setSocket(null)
    }
  }, [activeChat])

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  const onSubmit = (data: IFormValues) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error('Error: Socket is not ready yet for send')
      return
    }

    socketRef.current.send(JSON.stringify({ from, to, msg: data.message, action: 'send' }))
    reset()
  }

  return (
    <SafeAreaView pointerEvents="box-none" style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
        <View style={styles.chat}>
          <View style={styles.header}>
            <Text style={styles.headerText}>№{order} {anotherUser?.u_name}</Text>
            <TouchableOpacity onPress={() => setActiveChat(null)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>
          </View>

          <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent}>
            {messages.map((item, idx) => {
              const isAction = item.type === EMessageType.Action
              return (
                <View key={idx} style={[styles.message, isAction && styles.messageAction]}>
                  {item.from && <Text style={[styles.name, isAction && styles.nameCentered]}>{item.from === from ? 'You' : anotherUser?.u_name}</Text>}
                  <View>
                    <Text style={styles.messageText}>{item.text}</Text>
                  </View>
                </View>
              )
            })}
          </ScrollView>

          <View style={styles.footer}>
            <Controller
              control={control}
              name="message"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter message text"
                    multiline
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    returnKeyType="send"
                  />
                  <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>✉</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    zIndex: 500,
    width: 320,
    maxWidth: '92%',
    height: 400,
  },
  keyboard: {
    flex: 1,
  },
  chat: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Android elevation
    elevation: 4,
  },
  header: {
    backgroundColor: 'blue',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  messages: {
    padding: 5,
    flex: 1,
  },
  messagesContent: {
    paddingBottom: 8,
  },
  message: {
    marginBottom: 10,
  },
  messageAction: {
    fontStyle: 'italic',
    alignItems: 'center',
  },
  name: {
    color: '#333',
    fontSize: 15,
    marginBottom: 2,
  },
  nameCentered: {
    textAlign: 'center',
    width: '100%',
    fontSize: 14,
    justifyContent: 'center',
  },
  messageText: {
    fontWeight: '300',
    fontSize: 14,
  },
  footer: {
    height: 50,
    borderTopWidth: 1,
    borderTopColor: '#000',
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingLeft: 5,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  sendButton: {
    height: 40,
    borderRadius: 3,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: 'transparent',
  },
  sendButtonText: {
    fontSize: 18,
  },
})

export default connector(Chat)
