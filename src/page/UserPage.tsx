import React, { useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../common/components/common'
import { PageTitle } from '../common/components/Typography'
import ItemForm from '../common/input/ItemForm'

const UserPageView = styled(Page)``

export type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const UserPage = observer(({ children }: PropTypes) => {
  let [user, setUser] = useStateValue('user')

  let operatorIds = user.operatorIds || ['None']

  let onChange = useCallback(() => {}, [])

  let onDone = useCallback(() => {}, [])

  let onCancel = useCallback(() => {}, [])

  return (
    <UserPageView>
      <PageTitle>Käyttäjä</PageTitle>
      <ItemForm
        onChange={onChange}
        onDone={onDone}
        onCancel={onCancel}
        style={{ marginRight: '1rem', marginLeft: '1rem' }}
        item={{ ...user, operatorIds }}
      />
    </UserPageView>
  )
})

export default UserPage
