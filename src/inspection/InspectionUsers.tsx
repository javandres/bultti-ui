import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useStateValue } from '../state/useAppState'
import ExpandableSection, {
  HeaderMainHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import { useMutationData } from '../util/useMutationData'
import {
  inspectionUserRelationsQuery,
  toggleUserInspectionSubscription,
} from './inspectionQueries'
import { useQueryData } from '../util/useQueryData'
import { LoadingDisplay } from '../common/components/Loading'
import { useRefetch } from '../util/useRefetch'
import UserRelations from '../common/components/UserRelations'
import { Inspection } from '../schema-types'

export type PropTypes = {
  inspection: Inspection
}

const InspectionUsers: React.FC<PropTypes> = observer(({ inspection }) => {
  var [user] = useStateValue('user')

  let { data: inspectionRelations, loading: relationsLoading, refetch } = useQueryData(
    inspectionUserRelationsQuery,
    {
      variables: {
        inspectionId: inspection.id,
      },
    }
  )

  let refetchRelations = useRefetch(refetch)

  let [toggleSubscribed, { loading: userSubscribedLoading }] = useMutationData(
    toggleUserInspectionSubscription
  )

  let onToggleSubscribed = useCallback(async () => {
    if (user) {
      await toggleSubscribed({
        variables: {
          inspectionId: inspection.id,
          userId: user.id,
        },
      })

      refetchRelations()
    }
  }, [inspection, user, toggleSubscribed, refetchRelations])

  const stopEventPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

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
              onClick={(e: React.MouseEvent) => {
                refetchRelations()
                stopEventPropagation(e)
              }}>
              Päivitä
            </Button>
          </HeaderSection>
        </>
      }>
      <LoadingDisplay loading={relationsLoading} />
      <UserRelations
        relations={inspectionRelations}
        loading={userSubscribedLoading}
        onToggleSubscribed={onToggleSubscribed}
      />
    </ExpandableSection>
  )
})

export default InspectionUsers
