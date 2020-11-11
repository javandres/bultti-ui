import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Input from '../common/input/Input'
import { omit } from 'lodash'
import { ControlGroup } from '../common/components/form'
import Dropdown from '../common/input/Dropdown'
import { Button, ButtonSize, ButtonStyle, RemoveButton } from '../common/components/Button'
import { CrossThick } from '../common/icon/CrossThick'
import { text } from '../util/translate'
import ToggleButton from '../common/input/ToggleButton'
import { FlexRow } from '../common/components/common'
import { SubHeading } from '../common/components/Typography'
import { FilterConfig, FilterMode } from '../schema-types'

const ReportTableFiltersView = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: var(--white-grey);
  border-radius: 1rem;
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

const FilterButtonsWrapper = styled.div`
  margin-left: auto;
  align-self: flex-end;
  margin-bottom: 0.875rem;
  flex: 0;
`

export type PropTypes<ItemType = any> = {
  onApply: () => unknown
  items: ItemType[]
  excludeFields?: string[]
  fieldLabels?: { [key in keyof ItemType]?: string }
  filters: FilterConfig[]
  setFilters: (arg: ((filters: FilterConfig[]) => FilterConfig[]) | FilterConfig[]) => unknown
}

const ReportTableFilters = observer(
  <ItemType extends {}>({
    items,
    excludeFields = [],
    fieldLabels = {},
    onApply = () => {},
    filters,
    setFilters,
  }: PropTypes<ItemType>) => {
    let onAddFilter = useCallback((field = '') => {
      setFilters((currentFilters) => {
        let newFilter: FilterConfig = {
          field,
          filterValue: '',
          filterMode: FilterMode.Exclusive,
        }
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

    let onChangeFilterMode = useCallback((index: number, value: FilterMode) => {
      setFilters((currentFilters) => {
        let nextFilters = [...currentFilters]
        let filterConfig = nextFilters[index]

        if (filterConfig) {
          filterConfig.filterMode = value
          return nextFilters
        }

        return currentFilters
      })
    }, [])

    let onChangeFilterField = useCallback(
      (index, setField: { field: string; label: string }) => {
        if (!setField) {
          return
        }

        setFilters((currentFilters) => {
          let nextFilters = [...currentFilters]
          let filterConfig = nextFilters[index]

          if (filterConfig) {
            filterConfig.field = setField.field
            return nextFilters
          }

          return currentFilters
        })
      },
      []
    )

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

    let filterFieldOptions = useMemo(() => {
      let fields = omit(items[0], excludeFields)
      let options = Object.keys(fields).map((key) => ({
        field: key,
        label: fieldLabels[key] || key,
      }))

      return [{ field: '', label: 'Kaikki' }, ...options]
    }, [items, excludeFields])

    return (
      <ReportTableFiltersView>
        <FlexRow style={{ alignItems: 'center' }}>
          <SubHeading style={{ marginTop: 0, marginBottom: 0 }}>Filtteröinti</SubHeading>
          <Button
            style={{ marginLeft: '1rem' }}
            onClick={() => onAddFilter()}
            buttonStyle={ButtonStyle.SECONDARY}
            size={ButtonSize.SMALL}>
            Lisää kenttä
          </Button>
        </FlexRow>
        {filters.length !== 0 && (
          <>
            <FlexRow style={{ marginTop: '1.5rem', flexDirection: 'column' }}>
              {filters.map((filterConfig, index) => {
                let selectedFilterOption = filterFieldOptions.find(
                  (f) => f.field === filterConfig.field
                )

                return (
                  <ControlGroup
                    key={`${filterConfig.field}_${index}`}
                    style={{ width: '100%', marginBottom: '1.5rem' }}>
                    <Input
                      value={filterConfig.filterValue}
                      onChange={(nextVal) => onChangeFilter(index, nextVal)}
                      name="filter"
                      type="text"
                      theme="light"
                      label={`Filter on ${
                        selectedFilterOption?.label || text('general.app.all')
                      }`}
                    />
                    {filterFieldOptions.length !== 0 && (
                      <Dropdown
                        label="Field"
                        items={filterFieldOptions}
                        selectedItem={selectedFilterOption}
                        itemToString={(item) => item.field}
                        itemToLabel={(item) => item.label}
                        onSelect={(nextField) => onChangeFilterField(index, nextField)}
                      />
                    )}
                    <FilterButtonsWrapper>
                      <FilterModeButton
                        name="filter-mode"
                        isSwitch={true}
                        value="mode"
                        checked={filterConfig.filterMode === FilterMode.Inclusive}
                        preLabel="Supistava"
                        onChange={(nextVal) =>
                          onChangeFilterMode(
                            index,
                            nextVal ? FilterMode.Inclusive : FilterMode.Exclusive
                          )
                        }>
                        Laajentava
                      </FilterModeButton>
                    </FilterButtonsWrapper>
                    <FilterButtonsWrapper>
                      <RemoveButton onClick={() => onRemoveFilter(index)}>
                        <CrossThick fill="white" width="0.5rem" height="0.5rem" />
                      </RemoveButton>
                    </FilterButtonsWrapper>
                  </ControlGroup>
                )
              })}
            </FlexRow>
            <FlexRow>
              {filters.length !== 0 && (
                <FilterButtonBar>
                  <Button size={ButtonSize.LARGE} onClick={onApply}>
                    Käytä filtterit
                  </Button>
                </FilterButtonBar>
              )}
            </FlexRow>
          </>
        )}
      </ReportTableFiltersView>
    )
  }
)

export default ReportTableFilters
