import React from 'react'
import styled from 'styled-components'

const InspectionItemView = styled.div`
  
`

export type InspectionItemProps = {
  children?: React.ReactNode
}

const InspectionItem = ({ children }: InspectionItemProps) => {
  return (
    <InspectionItemView>
      <></>
    </InspectionItemView>
  )
}

export default InspectionItem
