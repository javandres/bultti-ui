import React from 'react'
import styled from 'styled-components'
import { Inspection, InspectionStatus } from '../schema-types'
import { getCreatedBy, useEditPreInspection } from './preInspectionUtils'
import ValueDisplay, {
  PropTypes as ValueDisplayPropTypes,
} from '../common/components/ValueDisplay'
import { format, parseISO } from 'date-fns'
import { READABLE_DATE_FORMAT, READABLE_TIME_FORMAT } from '../constants'
import InspectionActions from './InspectionActions'

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
        : p.status === InspectionStatus.InReview
        ? 'var(--yellow)'
        : 'var(--light-grey)'};
  box-shadow: ${(p) =>
    p.status === InspectionStatus.InProduction && p.inEffect
      ? '0 0 5px 0 var(--green)'
      : p.status === InspectionStatus.InReview
      ? '0 0 5px 0 var(--yellow)'
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

const InspectionActionsRow = styled(InspectionActions)`
  margin: auto -0.75rem 0;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
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

const PreInspectionItem: React.FC<InspectionItemProps> = ({
  inspection,
  className,
  isCurrentlyInEffect,
  onPreInspectionUpdated = () => {},
  showActions = true,
}) => {
  let editPreInspection = useEditPreInspection(inspection.id)
  let createdBy = getCreatedBy(inspection)

  return (
    <PreInspectionItemView
      className={className}
      status={inspection.status}
      inEffect={isCurrentlyInEffect}>
      <ItemContent
        item={{ ...inspection, createdBy }}
        labels={itemTableHeadings}
        objectPaths={itemObjectDisplayPaths}
        renderValue={renderValue}
      />
      {showActions && (
        <InspectionActionsRow
          inspection={inspection}
          onSelect={editPreInspection}
          onRefresh={onPreInspectionUpdated}
        />
      )}
    </PreInspectionItemView>
  )
}

export default PreInspectionItem
