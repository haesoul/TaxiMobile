import React, { useMemo } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { t, TRANSLATION } from '../../../localization'
import store, { IRootState } from '../../../state'
import { userActionCreators, userSelectors } from '../../../state/user'
import { normalizePhoneNumber } from '../../../tools/phoneUtils'
import { EStatuses, EUserRoles } from '../../../types/types'
import JSONForm from '../../JSONForm'
// import { TForm } from '../../JSONForm/types'
import type { TForm } from '../../JSONForm'




import ErrorFrame from '../../ErrorFrame'

const mapStateToProps = (state: IRootState) => {
  return {
    user: userSelectors.user(state),
    status: userSelectors.status(state),
    tab: userSelectors.tab(state),
    message: userSelectors.message(state),
    response: userSelectors.registerResponse(state),
  }
}

const mapDispatchToProps = {
  register: userActionCreators.register,
  setStatus: userActionCreators.setStatus,
  setMessage: userActionCreators.setMessage,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {
  isOpen: boolean;
}

function RegisterForm({
  status,
  message,
  register,
}: IProps) {

  const handleSubmit = (values: any) => {
    
    const isDriver = values.u_role === EUserRoles.Driver

    if (isDriver) {
      const normalizedPhone = normalizePhoneNumber(values.u_phone, true, true)
      values.u_phone = normalizedPhone
    }

    values.st = 1
    register(values)
  }

  let fields = useMemo(() => {
    try {
      const globalData = store.getState().global;
      const formStr = globalData.data?.site_constants?.form_register?.value
      return (JSON.parse(formStr).fields as TForm) ?? null
    } catch {
      return null
    }
  }, [])

  fields = useMemo(() =>
    fields &&
    message !== undefined &&
    message !== 'register_fail' &&
    status === EStatuses.Fail ?
      fields.map(field => field.component === 'alert' ?
        {
          ...field,
          props: {
            ...(field.props ?? {}),
            message: t(TRANSLATION.REGISTER_FAIL) + ': ' + message,
          },
        } :
        field,
      ) :
      fields
  , [message, status])

  if (fields === null)
    return <ErrorFrame title='Bad json in data.js' />

  return (
    <JSONForm
      fields={fields}
      onSubmit={handleSubmit}
      state={{
        success: status === EStatuses.Success,
        failed: status === EStatuses.Fail,
      }}
    />
  )
}

export default connector(RegisterForm)