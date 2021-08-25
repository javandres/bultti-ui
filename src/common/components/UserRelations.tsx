import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { orderBy } from 'lodash'
import {
  ContractUserRelation,
  ContractUserRelationType,
  InspectionUserRelation,
  InspectionUserRelationType,
} from '../../schema-types'
import { format, parseISO } from 'date-fns'
import { READABLE_TIME_FORMAT } from '../../constants'
import Checkbox from '../input/Checkbox'
import { useStateValue } from '../../state/useAppState'
import { CheckboxLabel } from '../input/ToggleLabel'
import { text } from '../../util/translate'

const UserList = styled.div`
  margin: -1rem -1rem 0;
`

const UserRow = styled.div`
  margin: 0;
  padding: 0.75rem 1rem;
  background: var(--white-grey);
  border-bottom: 1px solid var(--lightest-grey);

  &:nth-child(odd) {
    background: white;
  }
`

const RowTitle = styled.h5`
  margin: 0 0 0.5rem;
  font-size: 1rem;
`

const TitleTimestamp = styled.span`
  display: inline-block;
  margin-left: 1rem;
  font-weight: normal;
  font-size: 0.875rem;
`

const RowContent = styled.div`
  display: flex;
  align-items: center;
`

const RowUserName = styled.div`
  line-height: 1.6;
  margin: 0;
`

const UserRoleBadge = styled.div`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  background: var(--lighter-grey);
  color: var(--dark-grey);
  font-size: 0.75rem;
  margin-right: 0.5rem;
  line-height: 1.35;
`

export type UserRelation = InspectionUserRelation | ContractUserRelation
type UserRelationType = InspectionUserRelationType | ContractUserRelationType

const userRelationTypeMap = {
  CREATED_BY: 'createdBy',
  UPDATED_BY: 'updatedBy',
  PUBLISHED_BY: 'publishedBy',
  REJECTED_BY: 'rejectedBy',
  SUBMITTED_BY: 'submittedBy',
  MADE_SANCTIONABLE_BY: 'madeSanctionableBy',
  SANCTIONS_ABANDONED_BY: 'sanctionsAbandonedBy',
}

export type PropTypes = {
  relations: UserRelation[]
}

const UserRelations = observer(({ relations }: PropTypes) => {
  var [user] = useStateValue('user')

  let allRelations = orderBy<UserRelation>(relations || [], 'updatedAt', 'desc')

  return (
    <UserList>
      <UserRow>
        <RowTitle>Sinä</RowTitle>
        <RowContent>
          <RowUserName>
            <UserRoleBadge>{user?.role}</UserRoleBadge>
            {user?.name}
          </RowUserName>
        </RowContent>
      </UserRow>
      {allRelations.map((rel: UserRelation) => (
        <UserRow key={rel.id}>
          <RowTitle>
            {getUserRelationTypeText(rel.relatedBy)}
            <TitleTimestamp>
              {format(parseISO(rel.updatedAt), READABLE_TIME_FORMAT)}
            </TitleTimestamp>
          </RowTitle>
          <RowContent>
            <RowUserName>
              <UserRoleBadge>{rel.user.role}</UserRoleBadge>
              {rel.user.name} / {rel.user.organisation}
              <br />
              {rel.user.email}
            </RowUserName>
          </RowContent>
        </UserRow>
      ))}
    </UserList>
  )
})

const getUserRelationTypeText = (rel: UserRelationType) => {
  let key = userRelationTypeMap[rel]
  return key ? text(`userRelations_${key}`) : '-'
}

export default UserRelations
