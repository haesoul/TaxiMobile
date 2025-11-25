import { all, put, takeEvery } from 'redux-saga/effects'
import * as API from '../../API'
import { updateCompletedOrderDuration } from '../../tools/order'
import { call } from '../../tools/sagaUtils'
import { TAction } from '../../types'
import { ActionTypes } from './constants'

export const saga = function* () {
  yield all([
    takeEvery(ActionTypes.GET_ORDER_REQUEST, getOrderSaga),
  ])
}

function* getOrderSaga({ payload }: TAction) {
  yield put({ type: ActionTypes.GET_ORDER_START })

  try {
    let order = (yield* call(API.getOrder, payload))!
    order = updateCompletedOrderDuration(order)
    yield put({ type: ActionTypes.GET_ORDER_SUCCESS, payload: order })
  }

  catch (error) {
    yield put({
      type: ActionTypes.GET_ORDER_FAIL,
      payload: (error as Error).message,
    })
  }
}