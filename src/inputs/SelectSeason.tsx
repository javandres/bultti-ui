import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Dropdown from './Dropdown'
import { Season } from '../types/inspection'
import seasonsData from '../data/seasons.json'

export type PropTypes = {
  label?: string | null
  className?: string
  theme?: 'light' | 'dark'
  value: null | Season
  onSelect: (season: null | Season) => void
}

const SeasonsSelect = styled(Dropdown)``

const SelectSeason: React.FC<PropTypes> = observer(
  ({ onSelect, value = null, label, className, theme = 'light' }) => {
    const seasons: Season[] = useMemo(() => {
      const seasonsList = [...seasonsData]

      if (seasonsList[0]?.name !== '...') {
        seasonsList.unshift({ name: '...', year: 0, season: '' })
      }

      return seasonsList
    }, [])

    const onSelectSeason = useCallback(
      (selectedItem) => {
        let selectValue = selectedItem

        if (!selectedItem) {
          selectValue = null
        }

        onSelect(selectValue)
      },
      [onSelect]
    )

    const currentSeason = useMemo(
      () => (!value ? seasons[0] : seasons.find((op) => value.name === op.name) || seasons[0]),
      [seasons, value]
    )

    return (
      <SeasonsSelect
        className={className}
        theme={theme}
        label={!label ? null : label || 'Aikataulukausi'}
        items={seasons}
        onSelect={onSelectSeason}
        selectedItem={currentSeason}
        itemToString="name"
        itemToLabel="name"
      />
    )
  }
)

export default SelectSeason
