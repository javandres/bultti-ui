import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Loading from '../common/components/Loading'
import RequirementsTable from './RequirementsTable'
import {
  createExecutionRequirementForProcurementUnitMutation,
  executionRequirementForProcurementUnitQuery,
} from './executionRequirementsQueries'
import { FlexRow, MessageView, SubSectionHeading } from '../common/components/common'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useMutationData } from '../util/useMutationData'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import { useLazyQueryData } from '../util/useLazyQueryData'
import RequirementEquipmentList, { equipmentColumnLabels } from './RequirementEquipmentList'
import {
  EquipmentWithQuota,
  requirementEquipment,
  useEquipmentCrud,
} from '../equipment/equipmentUtils'
import { parseISO } from 'date-fns'
import AddEquipment from '../equipment/AddEquipment'
import { ExecutionRequirement, ProcurementUnit } from '../schema-types'

const ProcurementUnitExecutionRequirementView = styled.div`
  margin-bottom: 2rem;
`

export type PropTypes = {
  procurementUnit: ProcurementUnit
}

const ProcurementUnitExecutionRequirement: React.FC<PropTypes> = observer(({ procurementUnit }) => {
  let preInspection = useContext(PreInspectionContext)
  let [shouldRefetch, setShouldRefetch] = useState(true)

  let queueRefetch = useCallback(() => setShouldRefetch(true), [])

  let [
    fetchRequirements,
    { data: procurementUnitRequirement, loading: requirementsLoading },
  ] = useLazyQueryData<ExecutionRequirement>(executionRequirementForProcurementUnitQuery)

  let [createPreInspectionRequirements, { loading: createLoading }] = useMutationData(
    createExecutionRequirementForProcurementUnitMutation
  )

  let onFetchRequirements = useCallback(async () => {
    if (preInspection && fetchRequirements) {
      await fetchRequirements({
        variables: {
          procurementUnitId: procurementUnit.id,
          preInspectionId: preInspection?.id,
        },
      })
    }
  }, [fetchRequirements, preInspection])

  let { removeAllEquipment, addEquipment } = useEquipmentCrud(
    procurementUnitRequirement || undefined,
    queueRefetch
  )

  let onCreateRequirements = useCallback(async () => {
    if (preInspection) {
      await createPreInspectionRequirements({
        variables: {
          procurementUnitId: procurementUnit.id,
          preInspectionId: preInspection?.id,
        },
      })

      queueRefetch()
    }
  }, [createPreInspectionRequirements, preInspection])

  const equipment: EquipmentWithQuota[] = useMemo(
    () => (procurementUnitRequirement ? requirementEquipment(procurementUnitRequirement) : []),
    [procurementUnitRequirement]
  )

  let hasEquipment = useCallback(
    (checkItem?: any) =>
      !checkItem ? false : equipment.some((eq) => eq.vehicleId === checkItem?.vehicleId),
    [equipment]
  )

  const inspectionStartDate = useMemo(
    () => (preInspection ? parseISO(preInspection.startDate) : new Date()),
    [preInspection]
  )

  useEffect(() => {
    if (shouldRefetch) {
      setShouldRefetch(false)
      onFetchRequirements()
    }
  }, [shouldRefetch, onFetchRequirements])

  return (
    <ProcurementUnitExecutionRequirementView>
      <FlexRow style={{ marginBottom: '1rem' }}>
        <SubSectionHeading>Kohteen suoritevaatimukset</SubSectionHeading>
        <Button
          onClick={queueRefetch}
          style={{ marginLeft: 'auto' }}
          buttonStyle={ButtonStyle.SECONDARY}
          size={ButtonSize.SMALL}>
          Päivitä
        </Button>
      </FlexRow>
      {requirementsLoading && <Loading />}
      {procurementUnitRequirement ? (
        <>
          <RequirementEquipmentList
            startDate={inspectionStartDate}
            onEquipmentChanged={queueRefetch}
            equipment={equipment}
            executionRequirement={procurementUnitRequirement}
          />
          <AddEquipment
            operatorId={procurementUnitRequirement.operator.id}
            equipment={equipment}
            onEquipmentChanged={queueRefetch}
            hasEquipment={hasEquipment}
            addEquipment={addEquipment}
            removeAllEquipment={removeAllEquipment}
            editableKeys={['percentageQuota']}
            fieldLabels={equipmentColumnLabels}
          />
          <RequirementsTable executionRequirement={procurementUnitRequirement} />
        </>
      ) : (
        <>
          <MessageView>Suoritevaatimukset ei laskettu.</MessageView>
          <Button loading={createLoading} onClick={onCreateRequirements}>
            Laske kohteen suoritevaatimukset
          </Button>
        </>
      )}
    </ProcurementUnitExecutionRequirementView>
  )
})

export default ProcurementUnitExecutionRequirement
