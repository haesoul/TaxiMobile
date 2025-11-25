// Sandbox.tsx
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import _ from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
// Добавляем KeyboardAvoidingView, Platform, useWindowDimensions
import Header from '@/components/Header'
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import JsonEditor from '../../components/JsonEditor'
import styles from './STYLES'

type Settings = { [key: string]: any }
const STORAGE_KEY = 'settings'
const defaultSettings: Settings = { blocks: [{ text: 'hello world' }] }

const Sandbox: React.FC = () => {
  const { width } = useWindowDimensions()
  // Если ширина меньше 768px, считаем это телефоном
  const isMobile = width < 768
  // Состояние для переключения вкладок на мобильном (editor | preview)
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')

  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [contentKey, setContentKey] = useState<number>(Date.now())
  const [editorText, setEditorText] = useState<string>(JSON.stringify(defaultSettings, null, 2))
  const parseErrorRef = useRef<boolean>(false)

  const updateFrameKey = useCallback(() => setContentKey(Date.now()), [])

  // debounced parser
  const debouncedParse = useRef(
    _.debounce(async (text: string) => {
      try {
        const parsed = JSON.parse(text)
        parseErrorRef.current = false
        setSettings(parsed)
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
        updateFrameKey()
      } catch {
        parseErrorRef.current = true
      }
    }, 700)
  ).current

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY)
        const parsed = raw ? JSON.parse(raw) : defaultSettings
        setSettings(parsed)
        setEditorText(JSON.stringify(parsed, null, 2))
      } catch {
        setSettings(defaultSettings)
        setEditorText(JSON.stringify(defaultSettings, null, 2))
      }
    })()
    return () => {
      ;(debouncedParse as any).cancel && (debouncedParse as any).cancel()
    }
  }, [])

  const openFile = useCallback(async () => {
    try {
      const res = (await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: false,
      })) as any
      if (res && res.type === 'success' && res.uri) {
        const content = await FileSystem.readAsStringAsync(res.uri)
        try {
          const parsed = JSON.parse(content)
          setSettings(parsed)
          setEditorText(JSON.stringify(parsed, null, 2))
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
          updateFrameKey()
        } catch {}
      }
    } catch (err) {}
  }, [updateFrameKey])

  const saveFile = useCallback(async () => {
    try {
      const json = JSON.stringify(settings, null, 2)
      const filename = `data-${Date.now()}.json`
      // @ts-ignore
      const baseDir: string | null = (FileSystem as any).documentDirectory ?? (FileSystem as any).cacheDirectory ?? null
      if (!baseDir) return
      const uri = `${baseDir}${filename}`
      await FileSystem.writeAsStringAsync(uri, json)
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri)
      }
    } catch (err) {}
  }, [settings])

  const onEditorChange = useCallback((text: string) => {
    setEditorText(text)
    debouncedParse(text)
  }, [debouncedParse])

  const form = useForm({
    ...(settings.formConfg || {}),
    criteriaMode: (settings.formConfg && settings.formConfg.criteriaMode) || 'all',
    mode: (settings.formConfg && settings.formConfg.mode) || 'onChange',
  } as any)
  const values = useWatch({ control: form.control })

  const renderEditor = () => (
    <View style={[styles.column, styles.columnEditor, isMobile && { flex: 1, borderRightWidth: 0 }]}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarGroup}>
          <TouchableOpacity onPress={openFile} style={styles.menuBtn}>
            <Text style={styles.menuBtnText}>OPEN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveFile} style={styles.menuBtn}>
            <Text style={styles.menuBtnText}>SAVE</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            setEditorText(JSON.stringify(settings, null, 2))
            updateFrameKey()
          }}
          style={[styles.menuBtn, styles.actionBtn]}
        >
          <Text style={[styles.menuBtnText, styles.actionBtnText]}>REFRESH</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsEditor} key={contentKey}>
        <JsonEditor value={editorText} onChange={onEditorChange} />
      </View>
    </View>
  )

  // const renderPreview = () => (
  //   <View style={[styles.column, styles.columnContent, isMobile && { flex: 1 }]}>
  //     <ScrollView
  //       contentContainerStyle={styles.scrollContainer}
  //       showsVerticalScrollIndicator={false}
  //       keyboardShouldPersistTaps="handled"
  //     >
  //       <View style={styles.deviceSimulator}>
  //         <ConstructorTab form={form} values={values} settings={settings} />
  //       </View>
  //     </ScrollView>
  //   </View>
  // )



  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

    >
      <Header/>
      <View style={styles.columns}>
        

        {isMobile && (
          <View style={{ flexDirection: 'row', backgroundColor: '#252526', padding: 4 }}>
            <TouchableOpacity 
              onPress={() => setActiveTab('editor')}
              style={{ flex: 1, padding: 10, alignItems: 'center', backgroundColor: activeTab === 'editor' ? '#3883fa' : 'transparent', borderRadius: 4 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>JSON / Code</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setActiveTab('preview')}
              style={{ flex: 1, padding: 10, alignItems: 'center', backgroundColor: activeTab === 'preview' ? '#3883fa' : 'transparent', borderRadius: 4 }}
            >
               <Text style={{ color: 'white', fontWeight: 'bold' }}>Preview UI</Text>
            </TouchableOpacity>
          </View>
        )}


        {(!isMobile || activeTab === 'editor') && renderEditor()}


      </View>
    </KeyboardAvoidingView>
  )
}

export default Sandbox