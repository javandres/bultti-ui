import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useStateValue } from '../state/useAppState'
import { orderBy } from 'lodash'
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
import { Inspection, InspectionUserRelation } from '../schema-types'

export type PropTypes = {
  inspection: Inspection
}

const InspectionUsers: React.FC<PropTypes> = observer(({ inspection }) => {
  var [user] = useStateValue('user')
  let { data: inspectionUserRelations, loading: relationsLoading, refetch } = useQueryData<
    InspectionUserRelation[]
  >(inspectionUserRelationsQuery, {
    variables: {
      inspectionId: inspection.id,
    },
  })

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

  return (
    <ExpandableSection
      isExpanded={true}
      headerContent={
        <>
          <HeaderMainHeading>Tarkastuksen tiedot</HeaderMainHeading>
          <HeaderSection style={{ padding: '0.5rem 0.75rem', justifyContent: 'center' }}>
            <Button
              style={{ marginLeft: 'auto' }}
              buttonStyle={ButtonStyle.SECONDARY}
              size={ButtonSize.SMALL}
              onClick={refetchRelations}>
              Päivitä
            </Button>
          </HeaderSection>
        </>
      }>
      <LoadingDisplay loading={relationsLoading} />
      <UserRelations
        relations={inspectionUserRelations}
        loading={userSubscribedLoading}
        onToggleSubscribed={onToggleSubscribed}
      />
    </ExpandableSection>
  )
})

export default InspectionUsers
