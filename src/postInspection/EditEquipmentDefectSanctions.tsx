import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import {
  EquipmentDefectSanction,
  EquipmentDefectSanctionsResponse,
  EquipmentDefectSanctionUpdate,
  PostInspection,
} from '../schema-types'
import { createResponseId, useTableState } from '../common/table/useTableState'
import { Text } from '../util/translate'
import { useMutationData } from '../util/useMutationData'
import { gql } from '@apollo/client'
import FilteredResponseTable from '../common/table/FilteredResponseTable'
import { TabChildProps } from '../common/components/Tabs'
import { EditValue, NotApplicableValue, RenderInputType } from '../common/table/tableUtils'
import { DEFAULT_DECIMALS } from '../constants'
import { round } from '../util/round'
import { ValueOf } from '../type/common'
import { Button, ButtonSize, ButtonStyle } from '../common/components/buttons/Button'
import { FlexRow } from '../common/components/common'

const SanctionToggleLabel = styled.label`
  display: block;
  cursor: pointer;
  width: 100%;
`

const SanctionToggleInput = styled.input`
  display: block;
`

let sanctionColumnLabels: { [name in keyof Partial<EquipmentDefectSanction>]: string } = {
  procurementUnitId: 'Kilpailukohde',
  registryNumber: 'Rekisterinumero',
  departureId: 'Lähtötunnus',
  sanctionPercentageAmount: 'Sanktiomäärä',
  appliedSanctionPercentageAmount: 'Sanktioidaan',
  appliedSanctionFinancialAmount: 'Sanktioidaan',
  sanctionReason: 'Sanktioperuste',
  sanctionScopeKilometers: 'Kilometrisuorite',
  sanctionFinancialAmount: 'Sanktiosumma €',
  sanctionResultKilometers: 'Sanktioidut kilometrit',
  name: 'Vian nimi',
  description: 'Vian kuvaus',
  jolaId: 'JOLA tunnus',
  observationDate: 'Havaintopäivä',
  priority: 'Prioriteetti',
  startDate: 'Sanktioinnin alkupäivä',
  endDate: 'Sanktioinnin loppupäivä',
}

let renderSanctionInput: RenderInputType<EquipmentDefectSanction> = (key, val, onChange) => {
  return (
    <SanctionToggleLabel>
      <SanctionToggleInput
        type="checkbox"
        value={val + ''}
        onChange={() => onChange(val as string)}
        checked={val !== 0}
        name="sanctionable"
      />
    </SanctionToggleLabel>
  )
}

let inspectionEquipmentDefectSanctionsQuery = gql`
  query inspectionEquipmentDefectSanctions(
    $inspectionId: String!
    $filters: [InputFilterConfig!]
    $sort: [InputSortConfig!]
  ) {
    inspectionEquipmentDefectSanctions(
      inspectionId: $inspectionId
      filters: $filters
      sort: $sort
    ) {
      id
      inspectionId
      filteredCount
      totalCount
      sort {
        column
        order
      }
      filters {
        field
        filterValue
      }
      rows {
        id
        procurementUnitId
        departureId
        inspectionId
        sanctionPercentageAmount
        sanctionReason
        sanctionScopeKilometers
        appliedSanctionPercentageAmount
        sanctionResultKilometers
        sanctionFinancialAmount
        appliedSanctionFinancialAmount
        description
        startDate
        endDate
        jolaId
        name
        observationDate
        priority
        registryNumber
      }
    }
  }
`

let setSanctionMutation = gql`
  mutation setSanction($sanctionUpdates: [EquipmentDefectSanctionUpdate!]!) {
    updateEquipmentDefectSanctions(sanctionUpdates: $sanctionUpdates) {
      id
      appliedSanctionPercentageAmount
      appliedSanctionFinancialAmount
      sanctionResultKilometers
    }
  }
`

export type PropTypes = {
  inspection: PostInspection
} & TabChildProps

const EditEquipmentDefectSanctions = observer(({ inspection }: PropTypes) => {
  let tableState = useTableState()
  let { filters = [], sort = [] } = tableState
  let [pendingValues, setPendingValues] = useState<EditValue<EquipmentDefectSanction>[]>([])

  let {
    data: sanctionsData,
    loading,
    refetch,
  } = useQueryData<EquipmentDefectSanctionsResponse>(inspectionEquipmentDefectSanctionsQuery, {
    notifyOnNetworkStatusChange: true,
    skip: !inspection,
    partialRefetch: true,
    variables: {
      // Add a string variable that changes when the table state changes.
      // Without this it wouldn't refetch if eg. filters change.
      responseId: createResponseId({ filters, sort }),
      inspectionId: inspection.id,
      filters,
      sort,
    },
  })

  let [execSetSanctionMutation, { loading: setSanctionLoading }] = useMutationData<
    EquipmentDefectSanction[]
  >(setSanctionMutation, {
    update: (cache, result) => {
      // @ts-ignore faulty types
      let sanctionUpdates = result.data?.updateSanctions || []

      for (let update of sanctionUpdates) {
        let cacheId = cache.identify(update)

        cache.writeFragment({
          id: cacheId,
          data: {
            appliedSanctionPercentageAmount: update.appliedSanctionPercentageAmount,
            appliedSanctionFinancialAmount: update.appliedSanctionFinancialAmount,
            sanctionResultKilometers: update.sanctionResultKilometers,
          },
          fragment: gql`
            fragment SanctionFragment on EquipmentDefectSanction {
              appliedSanctionPercentageAmount
              appliedSanctionFinancialAmount
              sanctionResultKilometers
            }
          `,
        })
      }
    },
  })

  let onChangeSanction = useCallback(
    (
      key: keyof EquipmentDefectSanction,
      value: ValueOf<EquipmentDefectSanction>,
      item: EquipmentDefectSanction
    ) => {
      setPendingValues((currentValues) => {
        let existingEditValueIndex = currentValues.findIndex(
          (val) => val.key === key && val.itemId === item.id
        )

        let setValue =
          value === item.sanctionPercentageAmount ? 0 : item.sanctionPercentageAmount

        if (existingEditValueIndex !== -1) {
          currentValues.splice(existingEditValueIndex, 1)
        }

        let editValue = { item, itemId: item.id, key, value: setValue }
        return [...currentValues, editValue]
      })
    },
    []
  )

  let onSaveSanctions = useCallback(async () => {
    if (pendingValues.length === 0) {
      return
    }

    setPendingValues([])
    let updateValues: EquipmentDefectSanctionUpdate[] = []

    for (let editValue of pendingValues) {
      let updateValue: EquipmentDefectSanctionUpdate = {
        equipmentDefectSanctionId: editValue.itemId,
        [editValue.key]: editValue.value as number,
      }

      updateValues.push(updateValue)
    }

    await execSetSanctionMutation({
      variables: {
        sanctionUpdates: updateValues,
      },
    })
  }, [pendingValues])

  let onCancelEdit = useCallback(() => {
    setPendingValues([])
  }, [])

  let isLoading = loading || setSanctionLoading || false

  let renderValue = useCallback(
    (
      key: keyof EquipmentDefectSanction,
      val: ValueOf<EquipmentDefectSanction>,
      isHeader?: boolean,
      item?: EquipmentDefectSanction
    ) => {
      if (!val) {
        return NotApplicableValue
      }

      if (['sanctionFinancialAmount', 'appliedSanctionFinancialAmount'].includes(key)) {
        return round(val as number, DEFAULT_DECIMALS) + '€'
      }

      if (['sanctionPercentageAmount', 'appliedSanctionPercentageAmount'].includes(key)) {
        return round(val as number, DEFAULT_DECIMALS) + '%'
      }

      if (['sanctionScopeKilometers', 'sanctionResultKilometers'].includes(key)) {
        return round(val as number, DEFAULT_DECIMALS) + ' km'
      }

      if (
        item &&
        ['sanctionableValue'].includes(key) &&
        ['UNIT_EQUIPMENT_MAX_AGE_VIOLATION'].includes(item.sanctionReason)
      ) {
        return round(val as number, DEFAULT_DECIMALS)
      }

      return val
    },
    []
  )

  return (
    <>
      <FlexRow style={{ marginBottom: 0 }}>
        <Button
          style={{ marginLeft: 'auto' }}
          buttonStyle={ButtonStyle.SECONDARY}
          size={ButtonSize.SMALL}
          onClick={() => refetch()}>
          <Text>update</Text>
        </Button>
      </FlexRow>
      <FilteredResponseTable<EquipmentDefectSanction>
        loading={isLoading}
        data={sanctionsData}
        tableState={tableState}
        columnLabels={sanctionColumnLabels}
        keyFromItem={(item) => item.id}
        renderInput={renderSanctionInput}
        pendingValues={pendingValues}
        editableValues={['appliedSanctionPercentageAmount']}
        onSaveEdit={onSaveSanctions}
        onEditValue={onChangeSanction}
        onCancelEdit={onCancelEdit}
        isAlwaysEditable={true}
        renderValue={renderValue}
      />
    </>
  )
})

export default EditEquipmentDefectSanctions
