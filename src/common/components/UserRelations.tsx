import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { orderBy } from 'lodash'
import {
  ContractUserRelation,
  InspectionUserRelation,
  InspectionUserRelationType,
} from '../../schema-types'
import { format, parseISO } from 'date-fns'
import { READABLE_TIME_FORMAT } from '../../constants'
import Checkbox from '../input/Checkbox'
import { useStateValue } from '../../state/useAppState'
import { CheckboxLabel } from '../input/ToggleLabel'

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

const SubscribedCheckbox = styled(Checkbox)`
  margin-left: auto;

  ${CheckboxLabel} {
    font-size: 0.875rem;
  }
`

type RelationType = InspectionUserRelation & ContractUserRelation

export type PropTypes = {
  relations: RelationType[]
  onToggleSubscribed: () => unknown
  loading?: boolean
}

const UserRelations = observer(
  ({ relations, onToggleSubscribed, loading = false }: PropTypes) => {
    var [user] = useStateValue('user')

    let allRelations: RelationType[] = orderBy(relations || [], 'updatedAt', 'desc')
    let ownRelations = allRelations.filter((rel) => rel.user.email === user.email)

    let subscriptionRelation = ownRelations.find(
      (rel) => rel.relatedBy === InspectionUserRelationType.SubscribedTo
    )

    let isSubscribed =
      subscriptionRelation?.subscribed || ownRelations.some((rel) => rel.subscribed)

    return (
      <UserList>
        <UserRow>
          <RowTitle>Sinä</RowTitle>
          <RowContent>
            <RowUserName>
              <UserRoleBadge>{user.role}</UserRoleBadge>
              {user.name}
            </RowUserName>
            <SubscribedCheckbox
              loading={loading}
              label={isSubscribed ? 'Tilattu' : 'Ei tilattu'}
              onChange={onToggleSubscribed}
              checked={isSubscribed}
              name="subscribed"
              value="rel_subscribed"
            />
          </RowContent>
        </UserRow>
        {allRelations.map((rel) =>
          rel === subscriptionRelation ? null : (
            <UserRow key={rel.id}>
              <RowTitle>
                {rel.relatedBy}
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
          )
        )}
      </UserList>
    )
  }
)

export default UserRelations
