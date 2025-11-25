import React, { useEffect, useRef } from 'react'
import { Platform, View } from 'react-native'
import { WebView } from 'react-native-webview'

// Добавляем meta viewport для правильного масштаба на телефоне
// Увеличиваем шрифт (fontSize: 14px/16px), чтобы было удобно читать
const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        background-color: #1e1e1e; /* Темный фон под стать VS Code */
      }
      #editor {
        height: 100%;
        width: 100%;
      }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js"></script>
    <script>
      let editor;
      
      function init() {
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }});
        require(['vs/editor/editor.main'], function () {
          editor = monaco.editor.create(document.getElementById('editor'), {
            value: '',
            language: 'json',
            theme: 'vs-dark', // Темная тема
            automaticLayout: true,
            minimap: { enabled: false }, // Отключаем мини-карту на телефоне (места мало)
            fontSize: 16, // Крупный шрифт для телефона
            wordWrap: 'on', // Перенос строк
            scrollBeyondLastLine: false,
            // Настройки для лучшей работы тача
            scrollbar: {
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            }
          });

          // Отправляем изменения в RN
          editor.onDidChangeModelContent(() => {
            try {
              window.ReactNativeWebView.postMessage(editor.getValue());
            } catch(e) {}
          });
        });
      }
      
      // Функция для обновления текста ИЗВНЕ (от React Native)
      // Мы проверяем, отличается ли текст, чтобы не сбрасывать курсор
      document.addEventListener('message', function(event) {
         try {
            if (editor && editor.getValue() !== event.data) {
                // Сохраняем позицию курсора, если это возможно (сложно при полном изменении, но setValue сбрасывает)
                // Обычно setValue используется только при загрузке файла
                editor.setValue(event.data);
            }
         } catch(e) {}
      });

      window.onload = init;
    </script>
  </head>
  <body>
    <div id="editor"></div>
  </body>
</html>
`

interface JsonEditorProps {
  value: string
  onChange: (text: string) => void
}

export default function JsonEditor({ value, onChange }: JsonEditorProps) {
  const webviewRef = useRef<WebView>(null)
  
  const lastValueRef = useRef(value)

  useEffect(() => {

    if (value !== lastValueRef.current) {
      const safeBody = JSON.stringify(value)
      const js = `
        try {
          if (editor && editor.setValue) {
            // Проверка внутри JS тоже важна
            if (editor.getValue() !== ${safeBody}) {
               editor.setValue(${safeBody}); 
            }
          }
        } catch (e) {}
      `
      webviewRef.current?.injectJavaScript(js)

      lastValueRef.current = value 
    }
  }, [value])

  const handleMessage = (event: any) => {
    if (event.nativeEvent.data) {
      const text = event.nativeEvent.data
      lastValueRef.current = text
      onChange(text)
    }
  }

  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}

        hideKeyboardAccessoryView={false}
        keyboardDisplayRequiresUserAction={false} 
        nestedScrollEnabled={true}
        style={{ flex: 1, backgroundColor: '#1e1e1e' }}
        containerStyle={{ flex: 1 }}
        textZoom={100}
        androidLayerType={Platform.OS === 'android' ? 'hardware' : 'software'}
      />
    </View>
  )
}