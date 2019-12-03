import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useQueryData } from '../utils/useQueryData'
import gql from 'graphql-tag'

const OperatorFilterView = styled.div``

const vehiclesQuery = gql`
  query listOperators {
    operators {
      operatorId
      operatorName
    }
  }
`

export type OperatorFilterProps = {
  children?: React.ReactNode
}

const OperatorFilter = ({ children }: OperatorFilterProps) => {
  const { data } = useQueryData({ query: vehiclesQuery })

  const operators = useMemo(() => {
    const operatorList = data || []
    operatorList.unshift({ operatorId: 'all', operatorName: 'Kaikki' })
    return operatorList
  }, [data])

  return (
    <OperatorFilterView>
      {operators.map((operator) => (
        <div key={operator.operatorId}>{operator.operatorName}</div>
      ))}
    </OperatorFilterView>
  )
}

export default OperatorFilter
