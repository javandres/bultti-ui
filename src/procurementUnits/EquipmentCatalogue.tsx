import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Table, { CellContent } from '../common/components/Table'
import {
  Equipment,
  EquipmentCatalogue as EquipmentCatalogueType,
  EquipmentInput,
} from '../schema-types'
import EquipmentFormInput from './EquipmentFormInput'
import ItemForm from '../common/inputs/ItemForm'
import { Button } from '../common/components/Button'
import { useMutationData } from '../utils/useMutationData'
import { createEquipmentMutation } from './equipmentQuery'
import { MessageView } from '../common/components/common'
import { EquipmentWithQuota } from './ProcurementUnitItem'

const EquipmentCatalogueView = styled.div``

const TableHeading = styled.h5`
  margin-top: 2rem;
  margin-bottom: 0.5rem;

  &:first-child {
    margin-top: 0;
  }
`

const CatalogueDetails = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
`

const DetailsItem = styled.div`
  margin-right: 1rem;
  font-size: 0.875rem;
`

export type PropTypes = {
  catalogue?: EquipmentCatalogueType
  operatorId: number
  equipment: EquipmentWithQuota[]
  onEquipmentAdded: () => Promise<void>
  removeEquipment: (item: Equipment) => void
}

const equipmentColumnLabels = {
  vehicleId: 'Kylkinumero',
  make: 'Merkki',
  model: 'Malli',
  type: 'Kalustotyyppi',
  percentageQuota: 'Osuus',
  emissionClass: 'Euroluokka',
  co2: 'CO2 arvo',
  registryNr: 'Rekisterinumero',
  registryDate: 'Rekisteröintipäivä',
}

const equipmentInputValues = {
  percentageQuota: (val) => parseFloat(val),
  emissionClass: (val) => parseInt(val, 10),
}

const defaultGetVal = (val) => val
const getType = (key) => equipmentInputValues[key] || defaultGetVal

const equipmentIsValid = (e: EquipmentInput): boolean =>
  !!(e?.make && e?.model && e?.emissionClass && e?.type && e?.percentageQuota && e?.registryDate)

const createEquipmentKey = (e: Equipment) =>
  !equipmentIsValid(e) ? null : `${e?.make}${e?.model}${e.emissionClass}${e.type}`

const EquipmentCatalogue: React.FC<PropTypes> = observer(
  ({ catalogue, operatorId, equipment, onEquipmentAdded, removeEquipment }) => {
    const [pendingEquipment, setPendingEquipment] = useState<EquipmentInput | null>(null)
    const [createEquipment] = useMutationData(createEquipmentMutation)

    const addDraftEquipment = useCallback(() => {
      const inputRow: EquipmentInput = {
        vehicleId: '',
        make: '',
        model: '',
        type: '',
        exteriorColor: '',
        emissionClass: 1,
        co2: 0,
        registryDate: '',
        registryNr: '',
        percentageQuota: 0,
      }

      setPendingEquipment(inputRow)
    }, [])

    const onEquipmentInputChange = useCallback((key: string, nextValue) => {
      setPendingEquipment((currentPending) =>
        !currentPending ? null : { ...currentPending, [key]: getType(key)(nextValue) }
      )
    }, [])

    const onAddEquipment = useCallback(async () => {
      if (!catalogue) {
        return
      }

      setPendingEquipment(null)

      await createEquipment({
        variables: {
          operatorId,
          equipmentInput: pendingEquipment,
          catalogueId: catalogue.id,
        },
      })

      await onEquipmentAdded()
    }, [catalogue, operatorId, onEquipmentAdded, pendingEquipment])

    const renderEquipmentCell = useCallback((val: any, key: string, onChange) => {
      if (['id'].includes(key)) {
        return <CellContent>{val}</CellContent>
      }

      return <EquipmentFormInput value={val} valueName={key} onChange={onChange} />
    }, [])

    return (
      <EquipmentCatalogueView>
        <TableHeading>Kalustoluettelo</TableHeading>
        <CatalogueDetails>
          <DetailsItem>
            Aloituspäivä: <strong>{catalogue?.startDate}</strong>
          </DetailsItem>
          <DetailsItem>
            Loppupäivä: <strong>{catalogue?.endDate}</strong>
          </DetailsItem>
        </CatalogueDetails>
        {equipment.length !== 0 ? (
          <>
            <TableHeading>Ajoneuvot</TableHeading>
            <Table
              items={equipment}
              columnLabels={equipmentColumnLabels}
              onRemoveRow={(item) => () => removeEquipment(item)}
              getColumnTotal={(col) =>
                col === 'percentageQuota'
                  ? equipment.reduce((total, item) => {
                      total += item?.percentageQuota
                      return total
                    }, 0) + '%'
                  : ''
              }
            />
          </>
        ) : (
          <MessageView>Kalustoluettelossa ei ole ajoneuvoja.</MessageView>
        )}
        <>
          {!pendingEquipment && <Button onClick={addDraftEquipment}>Lisää ajoneuvo</Button>}
          {pendingEquipment && (
            <>
              <TableHeading>Lisää ajoneuvo</TableHeading>
              <ItemForm
                item={pendingEquipment}
                labels={equipmentColumnLabels}
                onChange={onEquipmentInputChange}
                onDone={onAddEquipment}
                doneDisabled={!equipmentIsValid(pendingEquipment)}
                doneLabel="Lisää luetteloon"
                renderInput={renderEquipmentCell}
              />
            </>
          )}
        </>
      </EquipmentCatalogueView>
    )
  }
)

export default EquipmentCatalogue
