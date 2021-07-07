import React, { FC } from 'react'
import styled from 'styled-components/macro'
import { Inspection, InspectionStatus, User } from '../schema-types'
import { getCreatedByUser, useCanOpenInspection } from './inspectionUtils'
import ValueDisplay, {
  PropTypes as ValueDisplayPropTypes,
} from '../common/components/ValueDisplay'
import InspectionActions from './InspectionActions'
import { getReadableDate } from '../util/formatDate'
import { text } from '../util/translate'
import { useStateValue } from '../state/useAppState'

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

const ItemContent = styled(ValueDisplay)`
  margin-bottom: 1rem;
  line-height: 1.4;
`

const InspectionActionsRow = styled(InspectionActions)`
  margin: auto -0.75rem 0;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
`

const itemTableHeadings = {
  name: 'Nimi',
  createdAt: 'Luontiaika',
  updatedAt: 'Viimeksi päivitetty',
  startDate: 'Tuotantokausi alkaa',
  endDate: 'Tuotantokausi loppuu',
  inspectionStartDate: 'Tarkastuskausi alkaa',
  inspectionEndDate: 'Tarkastuskausi loppuu',
  version: 'Versio',
  status: 'Tila',
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
      return getReadableDate(val)
    case 'startDate':
    case 'inspectionStartDate':
    case 'endDate':
    case 'inspectionEndDate':
      return getReadableDate(val)
    case 'status':
      if (val === InspectionStatus.Draft) {
        return text('inspection_state_Draft')
      }
      if (val === InspectionStatus.Sanctionable) {
        return text('inspection_state_Sanctionable')
      }
      if (val === InspectionStatus.InReview) {
        return text('inspection_state_Review')
      }
      if (val === InspectionStatus.InProduction) {
        return text('inspection_state_Production')
      }

      return `Inspection status not being supported: ${val}`
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
  let [globalOperator] = useStateValue('globalOperator')
  let canEditInspection = useCanOpenInspection({
    inspectionType: inspection.inspectionType,
    operatorId: globalOperator.id,
  })

  let createdBy = getCreatedByUser(inspection)

  return (
    <InspectionItemView
      className={className}
      status={inspection.status}
      inEffect={isCurrentlyInEffect}>
      <ItemContent<FC<ValueDisplayPropTypes<Inspection & { createdBy?: User }>>>
        item={{ ...inspection, createdBy }}
        labels={itemTableHeadings}
        objectPaths={itemObjectDisplayPaths}
        renderValue={renderValue}
      />
      {showActions && inspection && (
        <InspectionActionsRow
          inspection={inspection}
          onRefresh={onInspectionUpdated}
          isEditingAllowed={canEditInspection}
        />
      )}
    </InspectionItemView>
  )
}

export default InspectionItem
