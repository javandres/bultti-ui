import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { gql } from '@apollo/client'
import { InspectionContext } from '../inspection/InspectionContext'
import Table from '../common/components/Table'
import { Sanction } from '../schema-types'
import { PageSection } from '../common/components/common'

const PostInspectionSanctionsView = styled(PageSection)``

export type PropTypes = {
  children?: React.ReactNode
}

let sanctionsQuery = gql`
  query sanctions($inspectionId: String!) {
    inspectionSanctions(inspectionId: $inspectionId) {
      id
      entityIdentifier
      inspectionId
      sanctionAmount
      sanctionReason
      sanctionableKilometers
      sanctionableType
      appliedSanctionAmount
    }
  }
`

let sanctionColumnLabels = {
  sanctionableType: 'Sanktioitava kohde',
  entityIdentifier: 'Tunnus',
  sanctionAmount: 'Sanktiomäärä',
  appliedSanctionAmount: 'Sovellettu sanktiomäärä',
  sanctionReason: 'Sanktioperuste',
  sanctionableKilometers: 'Sanktioitavat kilometrit',
}

const PostInspectionSanctions = observer(({ children }: PropTypes) => {
  const inspection = useContext(InspectionContext)

  let { data: sanctionsData } = useQueryData(sanctionsQuery, {
    skip: !inspection,
    variables: {
      inspectionId: inspection?.id,
    },
  })

  return (
    <PostInspectionSanctionsView>
      <Table<Sanction>
        fluid={true}
        columnLabels={sanctionColumnLabels}
        items={sanctionsData || []}
      />
    </PostInspectionSanctionsView>
  )
})

export default PostInspectionSanctions
