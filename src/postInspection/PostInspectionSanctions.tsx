import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { gql } from '@apollo/client'
import ReportView from '../report/ReportView'
import ReportStateContext from '../report/ReportStateContext'
import { TabChildProps } from '../common/components/Tabs'
import { Inspection } from '../schema-types'

const PostInspectionSanctionsView = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 0 0.75rem 2rem;
  background-color: white;
`

export type PropTypes = {
  inspection: Inspection
} & TabChildProps

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

const PostInspectionSanctions = observer(({ inspection }: PropTypes) => {
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
