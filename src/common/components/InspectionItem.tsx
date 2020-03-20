import React from 'react'
import styled from 'styled-components'
import { useQueryData } from '../../util/useQueryData'
import gql from 'graphql-tag'
import { Inspection } from '../../type/inspection'

const operatorQuery = gql`
  query fetchOperator($id: Int!) {
    operator(operatorId: $id) {
      id
      operatorName
    }
  }
`

const InspectionItemView = styled.div``

export type InspectionItemProps = {
  inspection: Inspection
}

const InspectionItem = ({ inspection }: InspectionItemProps) => {
  const { data } = useQueryData(operatorQuery, {
    variables: { id: inspection.operatorId },
  })

  const operatorName = data?.operatorName || inspection.operatorId

  return (
    <InspectionItemView>
      <pre>
        <code>{JSON.stringify({ operatorName, ...inspection }, null, 2)}</code>
      </pre>
    </InspectionItemView>
  )
}

export default InspectionItem
