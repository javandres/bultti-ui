import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Input from '../common/input/Input'
import { compact, groupBy, lowerCase, omit } from 'lodash'
import { strval } from '../util/strval'
import { ControlGroup } from '../common/components/form'
import Dropdown from '../common/input/Dropdown'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'

const ReportTableFiltersView = styled.div`
  margin-bottom: 1.5rem;
`

const FilterButtonBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
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

const ReportTableFilters = observer(
  ({ items, onFilterApplied, excludeFields = [] }: PropTypes) => {
    let [filters, setFilters] = useState<FilterConfig[]>([])

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

      let filteredItems: typeof items = []

      let filterFieldGroups: [string, string[]][] = compact(
        Object.entries(groupBy(filters, 'field')).map(([field, filterValues]) => {
          if (!field) {
            return null
          }

          let appliedFilterValues = filterValues
            .filter(({ filterValue }) => !!filterValue)
            .map(({ filterValue }) => lowerCase(filterValue))

          if (appliedFilterValues.length === 0) {
            return null
          }

          return [field, appliedFilterValues]
        })
      )

      if (filterFieldGroups.length === 0) {
        onFilterApplied(items)
        return
      }

      for (let item of items) {
        for (let [field, filterValues] of filterFieldGroups) {
          let itemValue = lowerCase(strval(item[field]))

          for (let filterValue of filterValues) {
            if (itemValue.includes(filterValue)) {
              filteredItems.push(item)
            }
          }
        }
      }

      onFilterApplied(filteredItems)
    }, [items, filters])

    let filterFieldOptions = useMemo(() => Object.keys(omit(items[0], excludeFields) || {}), [
      items,
      excludeFields,
    ])

    return (
      <ReportTableFiltersView>
        {filters.map((filterConfig, index) => (
          <ControlGroup
            key={`${filterConfig.field}_${index}`}
            style={{ width: '100%', marginBottom: '1rem' }}>
            <Input
              value={filterConfig.filterValue}
              onChange={(nextVal) => onChangeFilter(index, nextVal)}
              name="filter"
              type="text"
              theme="light"
              label={`Filter on ${filterConfig.field}`}
            />
            {filterFieldOptions.length !== 0 && (
              <Dropdown
                label="Field"
                items={filterFieldOptions}
                selectedItem={filterConfig.field}
                itemToString={(item) => item}
                itemToLabel={(item) => item}
                onSelect={(nextField) => onChangeFilterField(index, nextField)}
              />
            )}
            <div style={{ marginLeft: 'auto', alignSelf: 'flex-end', flex: 0 }}>
              <Button
                onClick={() => onRemoveFilter(index)}
                buttonStyle={ButtonStyle.REMOVE}
                size={ButtonSize.SMALL}>
                Poista
              </Button>
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
