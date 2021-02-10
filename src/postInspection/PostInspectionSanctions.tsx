import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { gql } from '@apollo/client'
import { InspectionContext } from '../inspection/InspectionContext'
import { PageSection } from '../common/components/common'
import ReportView from '../report/ReportView'
import ReportStateContext from '../report/ReportStateContext'

const PostInspectionSanctionsView = styled(PageSection)`
  margin-top: 1rem;
`

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

  let { data: sanctionsData, loading } = useQueryData(sanctionsQuery, {
    skip: !inspection,
    variables: {
      inspectionId: inspection?.id,
    },
  })

  return (
    <PostInspectionSanctionsView>
      <ReportStateContext>
        <ReportView
          loading={loading}
          reportType="list"
          columnLabels={sanctionColumnLabels}
          items={sanctionsData || []}
        />
      </ReportStateContext>
    </PostInspectionSanctionsView>
  )
})

export default PostInspectionSanctions
