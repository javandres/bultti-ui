import React from 'react'
import styled from 'styled-components'
import { InspectionStatus, Inspection } from '../schema-types'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import {
  useEditPreInspection,
  usePreInspectionReports,
  useRemovePreInspection,
} from './preInspectionUtils'
import ValueDisplay, {
  PropTypes as ValueDisplayPropTypes,
} from '../common/components/ValueDisplay'
import { format, parseISO } from 'date-fns'
import { READABLE_DATE_FORMAT, READABLE_TIME_FORMAT } from '../constants'

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
    p.status === InspectionStatus.InProduction && p.inEffect
      ? '0 0 5px 0 var(--green)'
      : 'none'};
  font-family: inherit;
  margin-right: 1rem;
  text-align: left;
  line-height: 1.4;
  display: flex;
  flex-direction: column;
  flex: 0 0 calc(33.333% - 1rem);
`

const ItemContent = styled(ValueDisplay)<ValueDisplayPropTypes>`
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
  inspection: Inspection
  isCurrentlyInEffect?: boolean
  showActions?: boolean
  className?: string
  onPreInspectionUpdated?: () => unknown
}

const renderValue = (key, val) => {
  switch (key) {
    case 'createdAt':
    case 'updatedAt':
      return format(parseISO(val), READABLE_TIME_FORMAT)
    case 'startDate':
    case 'endDate':
      return format(parseISO(val), READABLE_DATE_FORMAT)
    case 'status':
      return val === InspectionStatus.InProduction ? 'Tuotannossa' : 'Muokattavissa'
    default:
      return val
  }
}

const PreInspectionItem: React.FC<InspectionItemProps> = ({
  inspection,
  className,
  isCurrentlyInEffect,
  onPreInspectionUpdated = () => {},
  showActions = true,
}) => {
  let editPreInspection = useEditPreInspection(inspection.id)

  let [removePreInspection, { loading: removeLoading }] = useRemovePreInspection(
    onPreInspectionUpdated
  )

  let goToReports = usePreInspectionReports(inspection.id)

  return (
    <PreInspectionItemView
      className={className}
      status={inspection.status}
      inEffect={isCurrentlyInEffect}>
      <ItemContent
        item={inspection}
        labels={itemTableHeadings}
        objectPaths={itemObjectDisplayPaths}
        renderValue={renderValue}
      />
      {showActions && (
        <ButtonRow>
          {inspection.status === InspectionStatus.Draft && (
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
                onClick={() => removePreInspection(inspection)}>
                Poista
              </Button>
            </>
          )}
          {inspection.status === InspectionStatus.InProduction && (
            <Button
              buttonStyle={ButtonStyle.NORMAL}
              size={ButtonSize.MEDIUM}
              onClick={() => goToReports()}>
              Raportit
            </Button>
          )}
        </ButtonRow>
      )}
    </PreInspectionItemView>
  )
}

export default PreInspectionItem
