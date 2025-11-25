import { Platform, StatusBar, StyleSheet } from 'react-native'

const THEME = {
  primary: '#3883fa', // Ваш синий цвет
  primaryHover: '#2563EB',
  textLight: '#ffffff',
  bgEditor: '#1e1e1e', // Темный фон для редактора (как в VS Code)
  bgCanvas: '#f3f4f6', // Светло-серый фон для превью
  border: '#e5e7eb',
}

const styles = StyleSheet.create({
  // Главный контейнер
  columns: {
    flex: 1,
    // flexDirection: 'row', // Разделение экрана пополам
    backgroundColor: THEME.bgCanvas,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  // Общие стили колонки
  column: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  // Левая колонка (Редактор)
  columnEditor: {
    flex: 0.45, // Занимает 45% экрана
    backgroundColor: THEME.bgEditor,
    borderRightWidth: 1,
    borderRightColor: '#333',
  },

  // Правая колонка (Контент/Превью)
  columnContent: {
    flex: 0.55, // Занимает 55% экрана
    backgroundColor: THEME.bgCanvas,
  },

  // Панель инструментов (Toolbar)
  toolbar: {
    height: 50,
    backgroundColor: '#252526', // Темно-серый, чуть светлее фона редактора
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    justifyContent: 'space-between', // Распределить кнопки
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10,
    elevation: 5,
  },

  // Группа кнопок слева
  toolbarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Кнопки меню
  menuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: 'transparent',
  },

  // Текст кнопок
  menuBtnText: {
    color: '#cccccc',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Акцентная кнопка (например, Refresh)
  actionBtn: {
    backgroundColor: THEME.primary,
    borderRadius: 4,
  },
  
  actionBtnText: {
    color: '#fff',
  },

  // Контейнер редактора JSON
  settingsEditor: {
    flex: 1,
    padding: 0, 
    // Если JsonEditor поддерживает стиль контейнера, можно добавить padding
  },

  // Область скролла справа
  scrollContainer: {
    flexGrow: 1,
    padding: 20, // Отступы для контента "телефона"
    alignItems: 'center', // Центрируем контент, если это симуляция телефона
  },

  // Симуляция "листа" или экрана устройства
  deviceSimulator: {
    width: '100%',
    maxWidth: 600, // Ограничение ширины для читаемости на больших экранах
    minHeight: 500,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
})

export default styles