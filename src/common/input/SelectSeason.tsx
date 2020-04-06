import React, { useCallback, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Season } from '../../schema-types'
import { useQueryData } from '../../util/useQueryData'
import { seasonsQuery } from '../query/seasonsQuery'
import { format, parseISO, startOfYear, subYears } from 'date-fns'
import { DATE_FORMAT } from '../../constants'
import { orderBy } from 'lodash'
import Dropdown from './Dropdown'

export type PropTypes = {
  label?: string | null
  className?: string
  theme?: 'light' | 'dark'
  value: null | Season
  onSelect: (season: null | Season) => void
  selectInitialId?: string
}

const currentDate = new Date()

const UNSELECTED_VAL = '...'

const SelectSeason: React.FC<PropTypes> = observer(
  ({ onSelect, value = null, label, className, theme = 'light', selectInitialId }) => {
    // Get seasons to display in the seasons select.
    const { data: seasonsData } = useQueryData(seasonsQuery, {
      variables: {
        date: format(startOfYear(subYears(currentDate, 5)), DATE_FORMAT),
      },
    })

    const seasons: Season[] = useMemo(() => {
      // Most current seasons first
      const seasonsList: Season[] = orderBy(
        !seasonsData ? [] : [...seasonsData],
        ({ startDate }) => parseISO(startDate).getTime(),
        'desc'
      )

      if (seasonsList[0]?.id !== '...') {
        const unselectedSeason: Season = {
          id: UNSELECTED_VAL,
          season: '',
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

    // Auto-select the first season if there is only one.
    useEffect(() => {
      let initialSeason = seasons.find((s) => s.id === selectInitialId)

      if (!value && initialSeason) {
        onSelect(initialSeason)
      }
      if (!value && !initialSeason && seasons.length !== 0) {
        onSelect(seasons.find((season) => season.id !== UNSELECTED_VAL) || null)
      }
    }, [value, seasons, onSelect, selectInitialId])

    const currentSeason = useMemo(() => value || seasons[0], [seasons, value])

    return (
      <Dropdown
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
