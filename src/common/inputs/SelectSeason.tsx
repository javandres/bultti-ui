import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Dropdown from './Dropdown'
import { Season } from '../../schema-types'
import { useQueryData } from '../../utils/useQueryData'
import { seasonsQuery } from '../../queries/seasonsQuery'

export type PropTypes = {
  label?: string | null
  className?: string
  theme?: 'light' | 'dark'
  value: null | Season
  onSelect: (season: null | Season) => void
}

const UNSELECTED_VAL = '...'

const SeasonsSelect = styled(Dropdown)``

const SelectSeason: React.FC<PropTypes> = observer(
  ({ onSelect, value = null, label, className, theme = 'light' }) => {
    const { data } = useQueryData(seasonsQuery)

    const seasons: Season[] = useMemo(() => {
      const seasonsList: Season[] = [...data]

      if (seasonsList[0]?.id !== '...') {
        const unselectedSeason: Season = {
          id: UNSELECTED_VAL,
          season: '',
          startDate: '',
          endDate: '',
        }
        seasonsList.unshift(unselectedSeason)
      }

      if (value && !seasonsList.find((s) => s?.id === value?.id)) {
        seasonsList.push(value)
      }

      return seasonsList
    }, [data, value])

    const onSelectSeason = useCallback(
      (selectedItem) => {
        let selectValue = selectedItem

        if (!selectedItem || selectedItem?.id === UNSELECTED_VAL) {
          selectValue = null
        }

        onSelect(selectValue)
      },
      [onSelect]
    )

    const currentSeason = useMemo(() => value || seasons[0], [seasons, value])

    return (
      <SeasonsSelect
        className={className}
        theme={theme}
        label={!label ? null : label || 'Aikataulukausi'}
        items={seasons}
        onSelect={onSelectSeason}
        selectedItem={currentSeason}
        itemToString="id"
        itemToLabel="id"
      />
    )
  }
)

export default SelectSeason
