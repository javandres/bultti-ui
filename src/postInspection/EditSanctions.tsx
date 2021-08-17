import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import {
  PostInspection,
  Sanction,
  SanctionException,
  SanctionScope,
  SanctionsResponse,
  SanctionUpdate,
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

let sanctionColumnLabels: { [name in keyof Partial<Sanction>]: string } = {
  procurementUnitId: 'Kilpailukohde',
  areaName: 'Alue',
  sanctionScope: 'Sanktioitava kohde',
  entityIdentifier: 'Tunnus',
  sanctionPercentageAmount: 'Sanktiomäärä',
  sanctionReason: 'Sanktioperuste',
  sanctionReasonValue: 'Sanktioon johtava arvo',
  sanctionScopeKilometers: 'Kilometrisuorite',
  appliedSanctionPercentageAmount: 'Sanktioidaan',
  sanctionFinancialAmount: 'Sanktiosumma €',
  sanctionResultKilometers: 'Sanktioidut kilometrit',
  matchesException: 'Sanktiopoikkeus',
}

let renderSanctionInput: RenderInputType<Sanction> = (key, val, onChange) => {
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

let sanctionsQuery = gql`
  query sanctions(
    $inspectionId: String!
    $filters: [InputFilterConfig!]
    $sort: [InputSortConfig!]
  ) {
    inspectionSanctions(inspectionId: $inspectionId, filters: $filters, sort: $sort) {
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
        areaName
        entityIdentifier
        inspectionId
        sanctionPercentageAmount
        sanctionReason
        sanctionScopeKilometers
        sanctionScope
        appliedSanctionPercentageAmount
        sanctionResultKilometers
        sanctionFinancialAmount
        sanctionReasonValue
        matchesException {
          id
          departureProperty
          exceptionAppliesToReason
          exceptionValue
        }
      }
    }
  }
`

let setSanctionMutation = gql`
  mutation setSanction($sanctionUpdates: [SanctionUpdate!]!) {
    updateSanctions(sanctionUpdates: $sanctionUpdates) {
      id
      appliedSanctionPercentageAmount
      sanctionResultKilometers
    }
  }
`

export type PropTypes = {
  inspection: PostInspection
} & TabChildProps

const EditSanctions = observer(({ inspection }: PropTypes) => {
  let tableState = useTableState()
  let { filters = [], sort = [] } = tableState
  let [pendingValues, setPendingValues] = useState<EditValue<Sanction>[]>([])

  let {
    data: sanctionsData,
    loading,
    refetch,
  } = useQueryData<SanctionsResponse>(sanctionsQuery, {
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

  let [execSetSanctionMutation, { loading: setSanctionLoading }] = useMutationData<Sanction[]>(
    setSanctionMutation,
    {
      update: (cache, result) => {
        // @ts-ignore faulty types
        let sanctionUpdates = result.data?.updateSanctions || []

        for (let update of sanctionUpdates) {
          let cacheId = cache.identify(update)

          cache.writeFragment({
            id: cacheId,
            data: {
              appliedSanctionPercentageAmount: update.appliedSanctionPercentageAmount,
              sanctionResultKilometers: update.sanctionResultKilometers,
            },
            fragment: gql`
              fragment SanctionFragment on Sanction {
                appliedSanctionPercentageAmount
                sanctionResultKilometers
              }
            `,
          })
        }
      },
    }
  )

  let onChangeSanction = useCallback(
    (key: keyof Sanction, value: ValueOf<Sanction>, item: Sanction) => {
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
    let updateValues: SanctionUpdate[] = []

    for (let editValue of pendingValues) {
      let updateValue: SanctionUpdate = {
        sanctionId: editValue.itemId,
        appliedSanctionPercentageAmount: editValue.value as number,
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
    (key: keyof Sanction, val: ValueOf<Sanction>, isHeader?: boolean, item?: Sanction) => {
      if (val === 0) {
        return '0'
      }

      if (!val) {
        return NotApplicableValue
      }

      if (key === 'sanctionFinancialAmount') {
        // Show 0 financial amount if the sanction is disabled.
        return item?.appliedSanctionPercentageAmount === 0
          ? 0
          : round(val as number, DEFAULT_DECIMALS) + '€'
      }

      if (
        (
          ['sanctionPercentageAmount', 'appliedSanctionPercentageAmount'] as (keyof Sanction)[]
        ).includes(key)
      ) {
        return round(val as number, DEFAULT_DECIMALS) + '%'
      }

      if (
        (
          ['sanctionScopeKilometers', 'sanctionResultKilometers'] as (keyof Sanction)[]
        ).includes(key)
      ) {
        return round(val as number, DEFAULT_DECIMALS) + ' km'
      }

      if (
        item &&
        ['sanctionableValue'].includes(key) &&
        ['UNIT_EQUIPMENT_MAX_AGE_VIOLATION'].includes(item.sanctionReason)
      ) {
        return round(val as number, DEFAULT_DECIMALS)
      }

      if (key !== 'entityIdentifier' || isHeader || !item) {
        return val
      }

      let idParts = String(val).split('_')

      switch (item.sanctionScope) {
        case SanctionScope.Departure:
          return `${idParts[0]} / ${idParts[1]} / ${idParts[2]} / ${idParts[3]}`
        case SanctionScope.OperatingArea:
          return `Alue: ${idParts[0]} Päästöluokka: ${idParts[1]}`
        case SanctionScope.ProcurementUnit:
          return `Kohde: ${idParts[0]} Ajoneuvon ikä: ${idParts[1]}`
        default:
          return val
      }
    },
    []
  )

  let transformItems = useCallback((items) => {
    return items.map((item) => {
      if (item.matchesException) {
        let exception: SanctionException = item.matchesException
        return {
          ...item,
          matchesException: `${exception.exceptionAppliesToReason}:${exception.departureProperty}:${exception.exceptionValue}`,
        }
      }

      return item
    })
  }, [])

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
      <FilteredResponseTable<Sanction>
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
        transformItems={transformItems}
      />
    </>
  )
})

export default EditSanctions
