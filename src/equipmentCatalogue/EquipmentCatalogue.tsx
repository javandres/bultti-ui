import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { EquipmentCatalogue as EquipmentCatalogueType, ProcurementUnit } from '../schema-types'
import ValueDisplay from '../common/components/ValueDisplay'
import CatalogueEquipmentList, { equipmentColumnLabels } from './CatalogueEquipmentList'
import {
  catalogueEquipment,
  EquipmentWithQuota,
  useEquipmentCrud,
} from '../equipment/equipmentUtils'
import AddEquipment from '../equipment/AddEquipment'
import EditEquipmentCatalogue, { equipmentCatalogueLabels } from './EditEquipmentCatalogue'

const EquipmentCatalogueView = styled.div``

export type PropTypes = {
  procurementUnit: ProcurementUnit
  startDate: Date
  catalogue?: EquipmentCatalogueType
  operatorId: number
  onCatalogueChanged: () => unknown
  editable: boolean
}

const EquipmentCatalogue: React.FC<PropTypes> = observer(
  ({ editable, procurementUnit, catalogue, startDate, operatorId, onCatalogueChanged }) => {
    let { removeAllEquipment, addEquipment, addBatchEquipment } = useEquipmentCrud(
      catalogue,
      onCatalogueChanged
    )

    const equipment: EquipmentWithQuota[] = useMemo(() => catalogueEquipment(catalogue), [
      catalogue,
    ])

    let hasEquipment = useCallback(
      (checkItem?: any) =>
        !checkItem ? false : equipment.some((eq) => eq.vehicleId === checkItem?.vehicleId),
      [equipment]
    )

    return (
      <EquipmentCatalogueView>
        {!editable && catalogue && (
          <ValueDisplay item={catalogue} labels={equipmentCatalogueLabels} />
        )}
        {editable && (
          <EditEquipmentCatalogue
            catalogue={catalogue}
            procurementUnit={procurementUnit}
            onChange={onCatalogueChanged}
          />
        )}
        {catalogue && (
          <>
            <CatalogueEquipmentList
              catalogueId={catalogue.id}
              operatorId={operatorId}
              equipment={equipment}
              startDate={startDate}
              onEquipmentChanged={onCatalogueChanged}
              equipmentEditable={editable}
            />
            {editable && (
              <AddEquipment
                operatorId={operatorId}
                equipment={equipment}
                onEquipmentChanged={onCatalogueChanged}
                hasEquipment={hasEquipment}
                editableKeys={['percentageQuota']}
                fieldLabels={equipmentColumnLabels}
                removeAllEquipment={removeAllEquipment}
                addEquipment={addEquipment}
                addBatchEquipment={addBatchEquipment}
              />
            )}
          </>
        )}
      </EquipmentCatalogueView>
    )
  }
)

export default EquipmentCatalogue
