import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../common/components/common'
import ItemForm from '../common/input/ItemForm'
import { useMutationData } from '../util/useMutationData'
import { modifyUserMutation } from '../common/query/authQueries'
import { LoadingDisplay } from '../common/components/Loading'
import { User, UserInput } from '../schema-types'
import { PageTitle } from '../common/components/PageTitle'

const UserPageView = styled(Page)``

export type PropTypes = RouteComponentProps

function createUserInput(user: User): UserInput {
  return {
    id: user.id,
    email: user.email,
    hslIdGroups: (user?.hslIdGroups || []).join(','),
    name: user.name,
    operatorIds: (user?.operatorIds || []).join(','),
    organisation: user.organisation,
    role: user.role,
  }
}

const UserPage: React.FC<PropTypes> = observer(() => {
  let [user, setUser] = useStateValue('user')
  let [pendingUser, setPendingUser] = useState(createUserInput(user))

  let onChange = useCallback((key, nextValue) => {
    setPendingUser((currentVal) => ({
      ...currentVal,
      [key]: nextValue,
    }))
  }, [])

  let [modifyUser, { data: nextUser, loading: userLoading }] = useMutationData(
    modifyUserMutation
  )

  useEffect(() => {
    if (nextUser && !userLoading) {
      setUser(nextUser)
      setPendingUser(createUserInput(nextUser))
    }
  }, [nextUser])

  let isDirty = useMemo(() => {
    let userJson = JSON.stringify(createUserInput(user))
    let pendingJson = JSON.stringify(pendingUser)
    return userJson !== pendingJson
  }, [user, pendingUser])

  let onDone = useCallback(() => {
    modifyUser({
      variables: {
        userInput: pendingUser,
      },
    })
  }, [pendingUser])

  let onCancel = useCallback(() => {
    setPendingUser(createUserInput(user))
  }, [])

  return (
    <UserPageView>
      <PageTitle>Käyttäjä</PageTitle>
      <LoadingDisplay loading={userLoading} />
      <ItemForm
        showButtons={isDirty}
        hideKeys={['id']}
        onChange={onChange}
        onDone={onDone}
        onCancel={onCancel}
        readOnly={['email', 'hslIdGroups']}
        style={{ marginRight: '1rem', marginLeft: '1rem' }}
        item={pendingUser}
      />
    </UserPageView>
  )
})

export default UserPage
