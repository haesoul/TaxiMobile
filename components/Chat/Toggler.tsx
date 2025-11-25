import React, { useCallback } from 'react'
import { GestureResponderEvent, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import images from '../../constants/images'
import { IRootState } from '../../state'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import { userSelectors } from '../../state/user'
import { IOrder, IUser } from '../../types/types'






const mapStateToProps = (state: IRootState) => ({
  user: userSelectors.user(state),
  activeChat: modalsSelectors.activeChat(state),
})

const mapDispatchToProps = {
  setActiveChat: modalsActionCreators.setActiveChat,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {
  anotherUserID: IUser['u_id']
  orderID: IOrder['b_id']
  small?: boolean
  onClick?: (e?: GestureResponderEvent) => void
}







const Toggler: React.FC<IProps> = ({
  activeChat,
  user,
  anotherUserID,
  orderID,
  small,
  setActiveChat,
  onClick,
}) => {
  const from = `${user?.u_id}_${orderID}`
  const to = `${anotherUserID}_${orderID}`
  const chatID = `${from};${to}`

  const handlePress = useCallback((e?: GestureResponderEvent) => {
    try { (e as any)?.stopPropagation?.() } catch (err) {}

    if (onClick) {
      onClick(e)
    } else {
      setActiveChat(activeChat === chatID ? null : chatID)
    }
  }, [onClick, setActiveChat, activeChat, chatID])

  const imageSource = images.chat as ImageSourcePropType


  return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.toggler,
          pressed && styles.togglerActive
        ]}
      >
        {/* {small ? <Image source={imageSource} style={styles.image}/> : <Text style={styles.togglerText}>✎</Text>} */}
        <View style={styles.image}>
          {
            small ? 
              <images.chat width={16} height={16}/>
              :
              <Text style={styles.togglerText}>✎</Text>
          }
          
        </View>
      </Pressable>

  )
}

const styles = StyleSheet.create({
  toggler: {
    backgroundColor: '#32CD32',
    padding: 5,
    height: 50,
    marginTop: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  togglerActive: {
    backgroundColor: 'green',
  },
  togglerText: {
    fontSize: 18,
    color: '#fff',
  },
  image: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  
})

export default connector(Toggler)
