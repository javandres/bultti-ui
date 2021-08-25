import React from 'react'
import { observer } from 'mobx-react-lite'
import ExpandableSection, { HeaderMainHeading } from '../common/components/ExpandableSection'
import { inspectionUserRelationsQuery } from './inspectionQueries'
import { useQueryData } from '../util/useQueryData'
import { LoadingDisplay } from '../common/components/Loading'
import UserRelations from '../common/components/UserRelations'
import { Inspection, InspectionUserRelation } from '../schema-types'

export type PropTypes = {
  inspection: Inspection
}

const InspectionUsers: React.FC<PropTypes> = observer(({ inspection }) => {
  let { data: inspectionUserRelations, loading: relationsLoading } = useQueryData<
    InspectionUserRelation[]
  >(inspectionUserRelationsQuery, {
    variables: {
      inspectionId: inspection.id,
    },
  })

  return (
    <ExpandableSection
      isExpanded={true}
      headerContent={<HeaderMainHeading>Tarkastuksen tiedot</HeaderMainHeading>}>
      <LoadingDisplay loading={relationsLoading} />
      <UserRelations relations={inspectionUserRelations} />
    </ExpandableSection>
  )
})

export default InspectionUsers
