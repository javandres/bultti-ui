import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Loading from '../common/components/Loading'
import RequirementsTable from './RequirementsTable'
import { ExecutionRequirement, ProcurementUnit } from '../schema-types'
import {
  createExecutionRequirementForProcurementUnitMutation,
  executionRequirementForProcurementUnitQuery,
} from './executionRequirementsQueries'
import { FlexRow, MessageView, SubSectionHeading } from '../common/components/common'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useMutationData } from '../util/useMutationData'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import { useLazyQueryData } from '../util/useLazyQueryData'
import RequirementEquipmentList from './RequirementEquipmentList'
import { EquipmentWithQuota, requirementEquipment } from '../equipment/equipmentUtils'
import { parseISO } from 'date-fns'

const ProcurementUnitExecutionRequirementView = styled.div`
  margin-bottom: 2rem;
`

export type PropTypes = {
  procurementUnit: ProcurementUnit
}

const ProcurementUnitExecutionRequirement: React.FC<PropTypes> = observer(({ procurementUnit }) => {
  let preInspection = useContext(PreInspectionContext)

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

  let onCreateRequirements = useCallback(async () => {
    if (preInspection) {
      await createPreInspectionRequirements({
        variables: {
          procurementUnitId: procurementUnit.id,
          preInspectionId: preInspection?.id,
        },
      })

      await onFetchRequirements()
    }
  }, [createPreInspectionRequirements, onFetchRequirements, preInspection])

  const equipment: EquipmentWithQuota[] = useMemo(
    () => (procurementUnitRequirement ? requirementEquipment(procurementUnitRequirement) : []),
    [procurementUnitRequirement]
  )

  const inspectionStartDate = useMemo(
    () => (preInspection ? parseISO(preInspection.startDate) : new Date()),
    [preInspection]
  )

  useEffect(() => {
    onFetchRequirements()
  }, [])

  return (
    <ProcurementUnitExecutionRequirementView>
      <FlexRow style={{ marginBottom: '1rem' }}>
        <SubSectionHeading style={{ marginBottom: 0 }}>
          Kohteen suoritevaatimukset
        </SubSectionHeading>
        <Button
          onClick={onFetchRequirements}
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
            onEquipmentChanged={onFetchRequirements}
            equipment={equipment}
            executionRequirement={procurementUnitRequirement}
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
