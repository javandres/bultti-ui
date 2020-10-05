import React from 'react'
import styled from 'styled-components'
import { Inspection, InspectionStatus, InspectionType } from '../schema-types'
import { getCreatedBy } from './inspectionUtils'
import ValueDisplay, {
  PropTypes as ValueDisplayPropTypes,
} from '../common/components/ValueDisplay'
import { format, parseISO } from 'date-fns'
import { READABLE_DATE_FORMAT, READABLE_TIME_FORMAT } from '../constants'
import InspectionActions from './InspectionActions'

const InspectionItemView = styled.div<{ status?: InspectionStatus; inEffect?: boolean }>`
  padding: 0.75rem 0.75rem 0;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  background: white;
  border: ${(p) =>
    p.status === InspectionStatus.InProduction && p.inEffect
      ? '3px solid var(--green)'
      : p.status === InspectionStatus.InProduction
      ? '1px solid var(--blue)'
      : p.status === InspectionStatus.InReview
      ? '2px solid var(--yellow)'
      : '1px solid var(--light-grey)'};
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

const InspectionActionsRow = styled(InspectionActions)`
  margin: auto -0.75rem 0;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
`

const itemTableHeadings = {
  createdAt: 'Luontiaika',
  updatedAt: 'Viimeksi päivitetty',
  startDate: 'Tuotantokausi alkaa',
  endDate: 'Tuotantokausi loppuu',
  inspectionStartDate: 'Tarkastuskausi alkaa',
  inspectionEndDate: 'Tarkastuskausi loppuu',
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
  onInspectionUpdated?: () => unknown
}

const renderValue = (key, val) => {
  switch (key) {
    case 'createdAt':
    case 'updatedAt':
      return format(parseISO(val), READABLE_TIME_FORMAT)
    case 'startDate':
    case 'inspectionStartDate':
    case 'endDate':
    case 'inspectionEndDate':
      return format(parseISO(val), READABLE_DATE_FORMAT)
    case 'status':
      if (val === InspectionStatus.InProduction) {
        return 'Tuotannossa'
      }

      if (val === InspectionStatus.InReview) {
        return 'Hyväksyttävänä'
      }

      return 'Muokattavissa'
    default:
      return val
  }
}

const InspectionItem: React.FC<InspectionItemProps> = ({
  inspection,
  className,
  isCurrentlyInEffect,
  onInspectionUpdated = () => {},
  showActions = true,
}) => {
  let createdBy = getCreatedBy(inspection)

  return (
    <InspectionItemView
      className={className}
      status={inspection.status}
      inEffect={isCurrentlyInEffect}>
      <ItemContent
        item={{ ...inspection, createdBy }}
        labels={itemTableHeadings}
        objectPaths={itemObjectDisplayPaths}
        renderValue={renderValue}
      />
      {showActions && inspection && (
        <InspectionActionsRow inspection={inspection} onRefresh={onInspectionUpdated} />
      )}
    </InspectionItemView>
  )
}

export default InspectionItem
