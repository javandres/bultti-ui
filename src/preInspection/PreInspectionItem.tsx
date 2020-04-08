import React from 'react'
import styled from 'styled-components'
import { InspectionStatus, PreInspection } from '../schema-types'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useEditPreInspection } from './useEditPreInspection'

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

const ButtonRow = styled.div`
  margin: auto -1rem 0;
  padding: 0.75rem 1rem 0.75rem;
  border-top: 1px solid var(--lighter-grey);
  background: var(--white-grey);
  display: flex;
  align-items: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;

  > * {
    margin-right: 1rem;
  }
`

export type InspectionItemProps = {
  preInspection: PreInspection
  className?: string
}

const PreInspectionItem: React.FC<InspectionItemProps> = ({ preInspection, className }) => {
  let editPreInspection = useEditPreInspection(preInspection.id)

  return (
    <PreInspectionItemView className={className}>
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
      <ButtonRow>
        {preInspection.status === InspectionStatus.Draft && (
          <Button
            buttonStyle={ButtonStyle.NORMAL}
            size={ButtonSize.MEDIUM}
            onClick={editPreInspection}>
            Muokkaa
          </Button>
        )}
      </ButtonRow>
    </PreInspectionItemView>
  )
}

export default PreInspectionItem
