import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useStateValue } from '../state/useAppState'
import ExpandableSection, {
  HeaderMainHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import { PreInspectionContext } from './PreInspectionContext'
import { format, parseISO } from 'date-fns'
import { READABLE_TIME_FORMAT } from '../constants'
import Checkbox, { CheckboxLabel } from '../common/input/Checkbox'
import { InspectionUserRelation, InspectionUserRelationType } from '../schema-types'
import { orderBy } from 'lodash'
import { useMutationData } from '../util/useMutationData'
import {
  inspectionUserRelationsQuery,
  toggleUserInspectionSubscription,
} from './preInspectionQueries'
import { useQueryData } from '../util/useQueryData'
import { LoadingDisplay } from '../common/components/Loading'
import { useRefetch } from '../util/useRefetch'

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

export type PropTypes = {}

const InspectionUsers: React.FC<PropTypes> = observer(() => {
  var [user] = useStateValue('user')
  var inspection = useContext(PreInspectionContext)

  let { data: inspectionRelations, loading: relationsLoading, refetch } = useQueryData(
    inspectionUserRelationsQuery,
    {
      skip: !inspection,
      variables: {
        inspectionId: inspection?.id,
      },
    }
  )

  let refetchRelations = useRefetch(refetch)

  let allRelations = orderBy(inspectionRelations || [], 'updatedAt', 'desc')
  let ownRelations = allRelations.filter((rel) => rel.user.email === user.email)

  let subscriptionRelation = ownRelations.find(
    (rel) => rel.relatedBy === InspectionUserRelationType.SubscribedTo
  )

  let isSubscribed =
    subscriptionRelation?.subscribed || ownRelations.some((rel) => rel.subscribed)

  let [toggleSubscribed, { loading: userSubscribedLoading }] = useMutationData(
    toggleUserInspectionSubscription
  )

  let onToggleSubscribed = useCallback(async () => {
    if (inspection && user) {
      await toggleSubscribed({
        variables: {
          inspectionId: inspection.id,
          userId: user.id,
        },
      })

      refetchRelations()
    }
  }, [inspection, user, toggleSubscribed, refetchRelations])

  return (
    <ExpandableSection
      headerContent={
        <>
          <HeaderMainHeading>Käyttäjät</HeaderMainHeading>
          <HeaderSection style={{ padding: '0.5rem 0.75rem', justifyContent: 'center' }}>
            <Button
              style={{ marginLeft: 'auto' }}
              buttonStyle={ButtonStyle.SECONDARY}
              size={ButtonSize.SMALL}
              onClick={() => {}}>
              Päivitä
            </Button>
          </HeaderSection>
        </>
      }>
      <LoadingDisplay loading={relationsLoading} />
      {inspection && (
        <UserList>
          <UserRow>
            <RowTitle>Sinä</RowTitle>
            <RowContent>
              <RowUserName>
                <UserRoleBadge>{user.role}</UserRoleBadge>
                {user.name}
              </RowUserName>
              <SubscribedCheckbox
                loading={userSubscribedLoading}
                label={isSubscribed ? 'Tilattu' : 'Ei tilattu'}
                onChange={onToggleSubscribed}
                checked={isSubscribed}
                name="subscribed"
                value="rel_subscribed"
              />
            </RowContent>
          </UserRow>
          {allRelations.map((rel: InspectionUserRelation) => (
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
                  {rel.user.name} @ {rel.user.organisation}
                  <br />
                  {rel.user.email}
                </RowUserName>
                <SubscribedCheckbox
                  label={rel?.subscribed || false ? 'Tilattu' : 'Ei tilattu'}
                  disabled={true}
                  checked={rel?.subscribed || false}
                  name="subscribed"
                  value="rel_subscribed"
                />
              </RowContent>
            </UserRow>
          ))}
        </UserList>
      )}
    </ExpandableSection>
  )
})

export default InspectionUsers
