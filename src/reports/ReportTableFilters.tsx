import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Input from '../common/input/Input'
import { compact, lowerCase, omit, trim } from 'lodash'
import { strval } from '../util/strval'
import { ControlGroup } from '../common/components/form'
import Dropdown from '../common/input/Dropdown'
import { Button, ButtonSize, ButtonStyle, RemoveButton } from '../common/components/Button'
import { CrossThick } from '../common/icon/CrossThick'
import { text } from '../util/translate'
import ToggleButton from '../common/input/ToggleButton'
import { FlexRow } from '../common/components/common'
import { SubHeading } from '../common/components/Typography'
import { useDebounce } from 'use-debounce'

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
  excludeFields?: string[]
  children: (filteredItems: ItemType[]) => React.ReactChild
  fieldLabels?: { [key in keyof ItemType]?: string }
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
  <ItemType extends {}>({
    items,
    children,
    excludeFields = [],
    fieldLabels = {},
  }: PropTypes<ItemType>) => {
    let [liveFilters, setFilters] = useState<FilterConfig[]>([{ field: '', filterValue: '' }])
    let [liveFilterMode, setFilterMode] = useState<FilterMode>(FilterMode.INCLUSIVE)

    let [filters] = useDebounce(liveFilters, 1000)
    let [filterMode] = useDebounce(liveFilterMode, 100)

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

    let currentFilteredItems = useMemo(() => {
      // If we have nothing to filter or nothing to filter on, return the items as-is.
      if (filters.length === 0 || !items || items.length === 0) {
        return items
      }

      // Get a simple string tuple from the filter values.
      // The first string is the field name, the second is the filter value.
      let filterFieldGroups: [string, string][] = compact(
        filters.map(({ field, filterValue }) => {
          if (!filterValue) {
            return null
          }

          return [field, filterValue]
        })
      )

      // No filters, no fun.
      if (filterFieldGroups.length === 0) {
        return items
      }

      // Collect all items that match a filter. An item should ideally only appear once.
      let filteredItems: typeof items = []

      // If the filter value matches a field value, add the item to the result array
      // if it's not yet present. Values are compared in lowercase.
      function matchValue(item, field, filterValue) {
        let inputValue = trim(lowerCase(filterValue))
        let itemValue = lowerCase(strval(item[field]))

        if (itemValue.includes(inputValue)) {
          if (!filteredItems.includes(item)) {
            filteredItems.push(item)
          }

          return true
        }

        return false
      }

      for (let [field, filterValue] of filterFieldGroups) {
        // Each field is visited in the order that the filters are set.
        // If the filter mode is inclusive, all items are evaluated for
        // each filtered field. If the mode is exclusive, only the
        // previously matched items are evaluated.
        let itemArray =
          filteredItems.length === 0 || filterMode === FilterMode.INCLUSIVE
            ? items
            : filteredItems

        // When using exclusive filtering, the result array is emptied on each iteration.
        // Otherwise results from previous fields would still be included even if they
        // don't match the field of the current iteration.
        if (filterMode === FilterMode.EXCLUSIVE) {
          filteredItems = []
        }

        // Evaluate each item in the source array and see if they match a filter.
        itemLoop: for (let item of itemArray) {
          if (!field) {
            // If the field is unset, that means that the filter value applies to all fields.
            // It is now necessary to visit each field of the current item and see if it matches.
            for (let itemField in item) {
              if (
                item.hasOwnProperty(itemField) &&
                !excludeFields.includes(itemField) && // Ensure the field is filterable
                matchValue(item, itemField, filterValue) // Match and add to result
              ) {
                // If the field matched, continue to the next item in the source array.
                // It is unnecessary to check this item further since it already matched.
                continue itemLoop
              }
            }
          } else if (!excludeFields.includes(field)) {
            // If the filter value is accompanied by a field name, we can check it directly.
            matchValue(item, field, filterValue) // Match and add to result
          }
        }
      }

      return filteredItems
    }, [items, filters, filterMode])

    let filterFieldOptions = useMemo(() => {
      let fields = omit(items[0], excludeFields)
      let options = Object.keys(fields).map((key) => ({
        field: key,
        label: fieldLabels[key] || key,
      }))

      return [{ field: '', label: 'Kaikki' }, ...options]
    }, [items, excludeFields])

    return (
      <>
        <ReportTableFiltersView>
          <FlexRow style={{ marginBottom: '1.5rem' }}>
            <SubHeading style={{ marginTop: 0, marginBottom: 0 }}>Filtteröinti</SubHeading>
            {liveFilters.length > 1 && (
              <FilterModeButton
                name="filter-mode"
                isSwitch={true}
                value="mode"
                checked={liveFilterMode === FilterMode.INCLUSIVE}
                preLabel="Supistava"
                onChange={toggleFilterMode}>
                Laajentava
              </FilterModeButton>
            )}
          </FlexRow>
          {liveFilters.map((filterConfig, index) => (
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
                  itemToString={(item) => item.field}
                  itemToLabel={(item) => item.label}
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
        {children(currentFilteredItems)}
      </>
    )
  }
)

export default ReportTableFilters
