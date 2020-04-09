import React from 'react'
import styled from 'styled-components'
import { InspectionStatus, PreInspection } from '../schema-types'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useNavigate } from '@reach/router'
import { useEditPreInspection, useRemovePreInspection } from './preInspectionUtils'
import ValueDisplay from '../common/components/ValueDisplay'

const PreInspectionItemView = styled.div<{ status?: InspectionStatus; inEffect?: boolean }>`
  padding: 0.75rem 0.75rem 0;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  background: white;
  border: 1px solid
    ${(p) =>
      p.status === InspectionStatus.InProduction && p.inEffect
        ? 'var(--green)'
        : p.status === InspectionStatus.InProduction
        ? 'var(--blue)'
        : 'var(--light-grey)'};
  box-shadow: ${(p) =>
    p.status === InspectionStatus.InProduction && p.inEffect ? '0 0 5px 0 var(--green)' : 'none'};
  font-family: inherit;
  margin-right: 1rem;
  text-align: left;
  line-height: 1.4;
  display: flex;
  flex-direction: column;
  flex: 0 0 calc(33.333% - 1rem);
`

const ItemContent = styled(ValueDisplay)`
  margin-bottom: 1rem;
  line-height: 1.4;
`

const ButtonRow = styled.div`
  margin: auto -0.75rem 0;
  padding: 0.75rem 1rem 0.75rem;
  border-top: 1px solid var(--lighter-grey);
  background: var(--white-grey);
  display: flex;
  align-items: center;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;

  > * {
    margin-right: 1rem;
  }
`

const itemTableHeadings = {
  createdAt: 'Luontiaika',
  updatedAt: 'Viimeksi päivitetty',
  startDate: 'Tuotanto-aika alkaa',
  endDate: 'Tuotanto-aika loppuu',
  version: 'Versio',
  status: 'Tila',
  createdBy: 'Luonut käyttäjä',
  season: 'Aiktaulukausi',
}

const itemObjectDisplayPaths = {
  createdBy: 'name',
  season: 'id',
}

export type InspectionItemProps = {
  preInspection: PreInspection
  isCurrentlyInEffect?: boolean
  className?: string
  onPreInspectionUpdated?: () => unknown
}

const PreInspectionItem: React.FC<InspectionItemProps> = ({
  preInspection,
  className,
  isCurrentlyInEffect,
  onPreInspectionUpdated = () => {},
}) => {
  let editPreInspection = useEditPreInspection(preInspection.id)
  let navigate = useNavigate()

  let [removePreInspection, { loading: removeLoading }] = useRemovePreInspection(
    onPreInspectionUpdated
  )

  return (
    <PreInspectionItemView
      className={className}
      status={preInspection.status}
      inEffect={isCurrentlyInEffect}>
      <ItemContent
        item={preInspection}
        labels={itemTableHeadings}
        objectPaths={itemObjectDisplayPaths}
      />
      <ButtonRow>
        {preInspection.status === InspectionStatus.Draft && (
          <>
            <Button
              buttonStyle={ButtonStyle.NORMAL}
              size={ButtonSize.MEDIUM}
              onClick={editPreInspection}>
              Muokkaa
            </Button>
            <Button
              style={{ marginLeft: 'auto', marginRight: 0 }}
              loading={removeLoading}
              buttonStyle={ButtonStyle.REMOVE}
              size={ButtonSize.MEDIUM}
              onClick={() => removePreInspection(preInspection)}>
              Poista
            </Button>
          </>
        )}
        {preInspection.status === InspectionStatus.InProduction && (
          <Button
            buttonStyle={ButtonStyle.NORMAL}
            size={ButtonSize.MEDIUM}
            onClick={() => navigate('pre-inspection/reports')}>
            Raportit
          </Button>
        )}
      </ButtonRow>
    </PreInspectionItemView>
  )
}

export default PreInspectionItem
