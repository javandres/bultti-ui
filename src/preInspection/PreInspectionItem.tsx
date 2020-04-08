import React from 'react'
import styled from 'styled-components'
import { PreInspection } from '../schema-types'

const PreInspectionItemView = styled.div`
  padding: 0.75rem 1rem 0;
  border-radius: 5px;
  margin-bottom: 1rem;
  background: white;
  border: 1px solid var(--blue);
  font-family: inherit;
  margin-right: 1rem;
  text-align: left;
  line-height: 1.4;
  display: flex;
  flex-direction: column;
  flex: 0 0 calc(33.333% - 1rem);
`

const ItemContent = styled.div`
  margin-bottom: 1rem;
  line-height: 1.4;
`

export type InspectionItemProps = {
  preInspection: PreInspection
}

const PreInspectionItem: React.FC<InspectionItemProps> = ({ preInspection }) => {
  return (
    <PreInspectionItemView>
      <ItemContent>
        ID: {preInspection.id}
        <br />
        Version: {preInspection.version}
        <br />
        Start date: {preInspection.startDate}
        <br />
        End date: {preInspection.endDate}
        <br />
        Status: {preInspection.status}
      </ItemContent>
    </PreInspectionItemView>
  )
}

export default PreInspectionItem
