import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import { Page, PageContainer } from '../common/components/common'
import ItemForm from '../common/input/ItemForm'
import { useMutationData } from '../util/useMutationData'
import { modifyUserMutation } from '../common/query/authQueries'
import { LoadingDisplay } from '../common/components/Loading'
import { User, UserInput, UserRole } from '../schema-types'
import { PageTitle } from '../common/components/PageTitle'
import { TextInput } from '../common/input/Input'
import Dropdown from '../common/input/Dropdown'
import { RouteChildrenProps } from 'react-router-dom'

const UserPageView = styled(Page)``

export type PropTypes = RouteChildrenProps

function createUserInput(user?: User): UserInput {
  return {
    id: user?.id || '',
    name: user?.name || '',
    operatorIds: (user?.operatorIds || []).join(','),
    organisation: user?.organisation || '',
    role: user?.role || UserRole.Blocked,
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

  let [modifyUser, { data: nextUser, loading: userLoading }] =
    useMutationData<User>(modifyUserMutation)

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

  let renderUserInput = useCallback(
    (key, val, onChange, readOnly) => {
      if (key === 'role') {
        return (
          <Dropdown
            items={['ADMIN', 'HSL', 'OPERATOR']}
            onSelect={onChange}
            selectedItem={val}
          />
        )
      }

      return (
        <TextInput
          type="text"
          value={val}
          onChange={(e) => onChange(e.target.value)}
          name={key}
          readOnly={readOnly}
        />
      )
    },
    [user]
  )

  if (!user) {
    return null
  }

  return (
    <UserPageView>
      <PageTitle>Käyttäjä</PageTitle>
      <PageContainer>
        <LoadingDisplay loading={userLoading} />
        <ItemForm
          showButtons={isDirty}
          hideKeys={['id']}
          onChange={onChange}
          onDone={onDone}
          onCancel={onCancel}
          readOnly={['email', 'hslIdGroups']}
          item={{ email: user?.email, hslIdGroups: user?.hslIdGroups, ...pendingUser }}
          renderInput={renderUserInput}
        />
      </PageContainer>
    </UserPageView>
  )
})

export default UserPage
