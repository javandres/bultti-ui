import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Dropdown from './Dropdown'
import { Season } from '../../schema-types'

export type PropTypes = {
  label?: string | null
  className?: string
  theme?: 'light' | 'dark'
  value: null | Season
  onSelect: (season: null | Season) => void
  seasons: Season[] | null
}

const UNSELECTED_VAL = '...'

const SeasonsSelect = styled(Dropdown)``

const SelectSeason: React.FC<PropTypes> = observer(
  ({ seasons: seasonsData, onSelect, value = null, label, className, theme = 'light' }) => {
    const seasons: Season[] = useMemo(() => {
      const seasonsList: Season[] = !seasonsData ? [] : [...seasonsData]

      if (seasonsList[0]?.id !== '...') {
        const unselectedSeason: Season = {
          id: UNSELECTED_VAL,
          season: 0,
          startDate: '',
          endDate: '',
          preInspections: [],
        }
        seasonsList.unshift(unselectedSeason)
      }

      if (value && !seasonsList.find((s) => s?.id === value?.id)) {
        seasonsList.push(value)
      }

      return seasonsList
    }, [seasonsData, value])

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
        label={!label ? '' : label || 'Aikataulukausi'}
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
