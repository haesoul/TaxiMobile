import { composeWithDevTools } from '@redux-devtools/extension';
import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { thunk } from 'redux-thunk';

// import thunkMiddleware from 'redux-thunk' // <-- Альтернативный вариант

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware()

export const configureStore = () => {
  const middleware = [thunk, sagaMiddleware]

  const enhancer = composeWithDevTools(
    applyMiddleware(...middleware)
  )

  const store = createStore(rootReducer, enhancer)

  sagaMiddleware.run(rootSaga)

  return store
}

const store = configureStore()

export default store

export type IRootState = ReturnType<typeof store.getState>
// export type RootState = ReturnType<typeof rootReducer>;

export type IDispatch = typeof store.dispatch





