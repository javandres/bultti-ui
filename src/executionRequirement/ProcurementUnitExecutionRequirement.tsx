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
import { SubSectionHeading } from '../common/components/Typography'

const ProcurementUnitExecutionRequirementView = styled.div`
  margin-bottom: 2rem;
  position: relative;
`

export type PropTypes = {
  procurementUnit: ProcurementUnit
}

const ProcurementUnitExecutionRequirement: React.FC<PropTypes> = observer(
  ({ procurementUnit }) => {
    let preInspection = useContext(PreInspectionContext)

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
      if (procurementUnit && preInspection && fetchRequirements) {
        await fetchRequirements({
          variables: {
            procurementUnitId: procurementUnit.id,
            preInspectionId: preInspection?.id,
          },
        })
      }
    }, [fetchRequirements, procurementUnit, preInspection])

    let queueRefetch = useRefetch(onFetchRequirements, true)

    let { addEquipment } = useEquipmentCrud(
      procurementUnitRequirement || undefined,
      queueRefetch
    )

    let onCreateRequirements = useCallback(async () => {
      if (preInspection) {
        await createExecutionRequirement({
          variables: {
            procurementUnitId: procurementUnit.id,
            preInspectionId: preInspection?.id,
          },
        })

        queueRefetch()
      }
    }, [createExecutionRequirement, preInspection])

    let onRefreshRequirements = useCallback(async () => {
      if (
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

        queueRefetch()
      }
    }, [procurementUnitRequirement, refreshExecutionRequirement])

    let removeExecutionRequirement = useCallback(async () => {
      if (
        procurementUnitRequirement &&
        confirm('Olet poistamassa tämän kilpailukohteen suoritevaatimukset. Oletko varma?')
      ) {
        await execRemoveExecutionRequirement({
          variables: {
            requirementId: procurementUnitRequirement.id,
          },
        })

        queueRefetch()
      }
    }, [procurementUnitRequirement, execRemoveExecutionRequirement, queueRefetch])

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
      () => (preInspection ? parseISO(preInspection.startDate) : new Date()),
      [preInspection]
    )

    let isLoading = requirementsLoading || createLoading || refreshLoading

    return (
      <ProcurementUnitExecutionRequirementView>
        <FlexRow style={{ marginBottom: '1rem', justifyContent: 'flex-start' }}>
          <SubSectionHeading style={{ marginBottom: 0 }}>
            Kohteen suoritevaatimukset
          </SubSectionHeading>
          <div style={{ display: 'flex', marginLeft: 'auto' }}>
            <Button
              loading={isLoading}
              onClick={queueRefetch}
              buttonStyle={ButtonStyle.SECONDARY}
              size={ButtonSize.SMALL}>
              Päivitä
            </Button>
            <Button
              loading={refreshLoading}
              onClick={onRefreshRequirements}
              style={{ marginLeft: '0.5rem' }}
              buttonStyle={ButtonStyle.SECONDARY}
              size={ButtonSize.SMALL}>
              Virkistä kalustoluettelosta
            </Button>
          </div>
        </FlexRow>
        <LoadingDisplay loading={requirementsLoading} />
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
              removeAllEquipment={removeExecutionRequirement}
              removeLabel="Poista suoritevaatimus"
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
  }
)

export default ProcurementUnitExecutionRequirement
