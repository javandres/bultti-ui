import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { LoadingDisplay } from '../common/components/Loading'
import RequirementsTable from './RequirementsTable'
import {
  createExecutionRequirementForProcurementUnitMutation,
  executionRequirementForProcurementUnitQuery,
  refreshExecutionRequirementForProcurementUnitMutation,
  removeExecutionRequirementMutation,
} from './executionRequirementsQueries'
import { FlexRow } from '../common/components/common'
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
import { useRefetch } from '../util/useRefetch'
import { MessageView } from '../common/components/Messages'
import { SubHeading } from '../common/components/Typography'

const ProcurementUnitExecutionRequirementView = styled.div`
  margin-bottom: 2rem;
  position: relative;
`

export type PropTypes = {
  procurementUnit: ProcurementUnit
  isEditable: boolean
  onUpdate?: () => unknown
}

const ProcurementUnitExecutionRequirement: React.FC<PropTypes> = observer(
  ({ procurementUnit, isEditable, onUpdate }) => {
    let inspection = useContext(PreInspectionContext)

    let [
      fetchRequirements,
      { data: procurementUnitRequirement, loading: requirementsLoading },
    ] = useLazyQueryData<ExecutionRequirement>(executionRequirementForProcurementUnitQuery)

    let [createExecutionRequirement, { loading: createLoading }] = useMutationData(
      createExecutionRequirementForProcurementUnitMutation
    )

    let [refreshExecutionRequirement, { loading: refreshLoading }] = useMutationData(
      refreshExecutionRequirementForProcurementUnitMutation
    )

    let [execRemoveExecutionRequirement] = useMutationData(removeExecutionRequirementMutation)

    let onFetchRequirements = useCallback(async () => {
      if (procurementUnit && inspection && fetchRequirements) {
        await fetchRequirements({
          variables: {
            procurementUnitId: procurementUnit.id,
            inspectionId: inspection?.id,
          },
        })
      }
    }, [fetchRequirements, procurementUnit, inspection])

    let updateRequirements = useRefetch(onFetchRequirements, true)

    let update = useCallback(() => {
      updateRequirements()

      if (onUpdate) {
        onUpdate()
      }
    }, [updateRequirements, onUpdate])

    let { addEquipment } = useEquipmentCrud(procurementUnitRequirement || undefined, update)

    let onCreateRequirements = useCallback(async () => {
      if (inspection) {
        await createExecutionRequirement({
          variables: {
            procurementUnitId: procurementUnit.id,
            inspectionId: inspection?.id,
          },
        })

        update()
      }
    }, [createExecutionRequirement, inspection])

    let onRefreshRequirements = useCallback(async () => {
      if (
        isEditable &&
        procurementUnitRequirement &&
        confirm(
          'Kalustoluettelosta löytyvät mutta ei suoritevaatimuksessa olevat ajoneuvot lisätään suoritevaatimukseen. Ok?'
        )
      ) {
        await refreshExecutionRequirement({
          variables: {
            executionRequirementId: procurementUnitRequirement.id,
          },
        })

        update()
      }
    }, [procurementUnitRequirement, refreshExecutionRequirement, isEditable])

    let removeExecutionRequirement = useCallback(async () => {
      if (
        isEditable &&
        procurementUnitRequirement &&
        confirm('Olet poistamassa tämän kilpailukohteen suoritevaatimukset. Oletko varma?')
      ) {
        await execRemoveExecutionRequirement({
          variables: {
            requirementId: procurementUnitRequirement.id,
          },
        })

        update()
      }
    }, [procurementUnitRequirement, execRemoveExecutionRequirement, update, isEditable])

    const equipment: EquipmentWithQuota[] = useMemo(
      () =>
        procurementUnitRequirement ? requirementEquipment(procurementUnitRequirement) : [],
      [procurementUnitRequirement]
    )

    let hasEquipment = useCallback(
      (checkItem?: any) =>
        !checkItem ? false : equipment.some((eq) => eq.vehicleId === checkItem?.vehicleId),
      [equipment]
    )

    const inspectionStartDate = useMemo(
      () => (inspection ? parseISO(inspection.startDate) : new Date()),
      [inspection]
    )

    let isLoading = requirementsLoading || createLoading || refreshLoading

    return (
      <ProcurementUnitExecutionRequirementView>
        <FlexRow style={{ marginBottom: '1rem', justifyContent: 'flex-start' }}>
          <SubHeading style={{ marginBottom: 0 }}>Kohteen suoritevaatimukset</SubHeading>
          <div style={{ display: 'flex', marginLeft: 'auto' }}>
            <Button
              loading={isLoading}
              onClick={update}
              buttonStyle={ButtonStyle.SECONDARY}
              size={ButtonSize.SMALL}>
              Päivitä
            </Button>
            {isEditable && (
              <Button
                loading={refreshLoading}
                onClick={onRefreshRequirements}
                style={{ marginLeft: '0.5rem' }}
                buttonStyle={ButtonStyle.SECONDARY}
                size={ButtonSize.SMALL}>
                Virkistä kalustoluettelosta
              </Button>
            )}
          </div>
        </FlexRow>
        <LoadingDisplay loading={requirementsLoading} />
        {procurementUnitRequirement ? (
          <>
            <RequirementEquipmentList
              isEditable={isEditable}
              startDate={inspectionStartDate}
              onEquipmentChanged={update}
              equipment={equipment}
              executionRequirement={procurementUnitRequirement}
            />
            {isEditable && (
              <AddEquipment
                operatorId={procurementUnitRequirement.operator.id}
                equipment={equipment}
                onEquipmentChanged={update}
                hasEquipment={hasEquipment}
                addEquipment={addEquipment}
                removeAllEquipment={removeExecutionRequirement}
                removeLabel="Poista suoritevaatimus"
                editableKeys={['percentageQuota']}
                fieldLabels={equipmentColumnLabels}
              />
            )}
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
  }
)

export default ProcurementUnitExecutionRequirement
