import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Input from '../common/input/Input'
import { compact, lowerCase, omit } from 'lodash'
import { strval } from '../util/strval'
import { ControlGroup } from '../common/components/form'
import Dropdown from '../common/input/Dropdown'
import { Button, ButtonSize, ButtonStyle, RemoveButton } from '../common/components/Button'
import { CrossThick } from '../common/icon/CrossThick'
import { text } from '../util/translate'
import ToggleButton from '../common/input/ToggleButton'
import { FlexRow } from '../common/components/common'
import { SubHeading } from '../common/components/Typography'

const ReportTableFiltersView = styled.div`
  margin-bottom: 1rem;
`

const FilterButtonBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const FilterModeButton = styled(ToggleButton)`
  flex: 0;
  display: inline-flex;
  align-self: flex-start;
  margin-left: auto;
  padding: 0;
`

export type PropTypes<ItemType = any> = {
  items: ItemType[]
  onFilterApplied: (items: ItemType[]) => unknown
  excludeFields?: string[]
}

type FilterConfig = {
  field: string
  filterValue: string
}

enum FilterMode {
  INCLUSIVE,
  EXCLUSIVE,
}

const ReportTableFilters = observer(
  ({ items, onFilterApplied, excludeFields = [] }: PropTypes) => {
    let [filters, setFilters] = useState<FilterConfig[]>([{ field: '', filterValue: '' }])
    let [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.INCLUSIVE)

    let toggleFilterMode = useCallback(() => {
      setFilterMode((currentMode) =>
        currentMode === FilterMode.INCLUSIVE ? FilterMode.EXCLUSIVE : FilterMode.INCLUSIVE
      )
    }, [])

    let onAddFilter = useCallback((field = '') => {
      setFilters((currentFilters) => {
        let newFilter: FilterConfig = { field, filterValue: '' }
        return [...currentFilters, newFilter]
      })
    }, [])

    let onChangeFilter = useCallback((index: number, value: string) => {
      setFilters((currentFilters) => {
        let nextFilters = [...currentFilters]
        let filterConfig = nextFilters[index]

        if (filterConfig) {
          filterConfig.filterValue = value
          return nextFilters
        }

        return currentFilters
      })
    }, [])

    let onChangeFilterField = useCallback((index, setField) => {
      if (!setField) {
        return
      }

      setFilters((currentFilters) => {
        let nextFilters = [...currentFilters]
        let filterConfig = nextFilters[index]

        if (filterConfig) {
          filterConfig.field = setField
          return nextFilters
        }

        return currentFilters
      })
    }, [])

    let onRemoveFilter = useCallback((index) => {
      setFilters((currentFilters) => {
        let nextFilters = [...currentFilters]
        let removed = nextFilters.splice(index, 1)

        if (removed.length !== 0) {
          return nextFilters
        }

        return currentFilters
      })
    }, [])

    useEffect(() => {
      if (filters.length === 0 || !items || items.length === 0) {
        onFilterApplied(items)
        return
      }

      let filterFieldGroups: [string, string][] = compact(
        filters.map(({ field, filterValue }) => {
          if (!filterValue) {
            return null
          }

          return [field, filterValue]
        })
      )

      if (filterFieldGroups.length === 0) {
        onFilterApplied(items)
        return
      }

      let filteredItems: typeof items = []

      function matchValue(item, field, filterValue) {
        let itemValue = lowerCase(strval(item[field]))

        if (itemValue.includes(filterValue)) {
          if (!filteredItems.includes(item)) {
            filteredItems.push(item)
          }

          return true
        }

        return false
      }

      for (let [field, filterValue] of filterFieldGroups) {
        let itemArray =
          filteredItems.length === 0 || filterMode === FilterMode.INCLUSIVE
            ? items
            : filteredItems

        if (filterMode === FilterMode.EXCLUSIVE) {
          filteredItems = []
        }

        itemLoop: for (let item of itemArray) {
          if (!field) {
            for (let itemField in item) {
              if (
                item.hasOwnProperty(itemField) &&
                !excludeFields.includes(itemField) && // Ensure the field is filterable
                matchValue(item, itemField, filterValue) // Match and add to result
              ) {
                continue itemLoop
              }
            }
          } else {
            matchValue(item, field, filterValue) // Match and add to result
          }
        }
      }

      onFilterApplied(filteredItems)
    }, [items, filters, filterMode])

    let filterFieldOptions = useMemo(
      () => ['', ...Object.keys(omit(items[0], excludeFields) || {})],
      [items, excludeFields]
    )

    return (
      <ReportTableFiltersView>
        <FlexRow style={{ marginBottom: '1.5rem' }}>
          <SubHeading style={{ marginTop: 0, marginBottom: 0 }}>Filtteröinti</SubHeading>
          {filters.length > 1 && (
            <FilterModeButton
              name="filter-mode"
              isSwitch={true}
              value="mode"
              checked={filterMode === FilterMode.INCLUSIVE}
              preLabel="Supistava"
              onChange={toggleFilterMode}>
              Laajentava
            </FilterModeButton>
          )}
        </FlexRow>
        {filters.map((filterConfig, index) => (
          <ControlGroup
            key={`${filterConfig.field}_${index}`}
            style={{ width: '100%', marginBottom: '1.5rem' }}>
            <Input
              value={filterConfig.filterValue}
              onChange={(nextVal) => onChangeFilter(index, nextVal)}
              name="filter"
              type="text"
              theme="light"
              label={`Filter on ${filterConfig.field || text('general.app.all')}`}
            />
            {filterFieldOptions.length !== 0 && (
              <Dropdown
                label="Field"
                items={filterFieldOptions}
                selectedItem={filterConfig.field}
                itemToString={(item) => item}
                itemToLabel={(item) => (!item ? text('general.app.all') : item)}
                onSelect={(nextField) => onChangeFilterField(index, nextField)}
              />
            )}
            <div style={{ marginLeft: 'auto', alignSelf: 'center', flex: 0 }}>
              <RemoveButton onClick={() => onRemoveFilter(index)}>
                <CrossThick fill="white" width="0.5rem" height="0.5rem" />
              </RemoveButton>
            </div>
          </ControlGroup>
        ))}
        <FilterButtonBar>
          <Button
            onClick={() => onAddFilter()}
            buttonStyle={ButtonStyle.NORMAL}
            size={ButtonSize.SMALL}>
            Lisää kenttä
          </Button>
        </FilterButtonBar>
      </ReportTableFiltersView>
    )
  }
)

export default ReportTableFilters
