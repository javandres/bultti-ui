import React, { useCallback, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Season } from '../../schema-types'
import { parseISO } from 'date-fns'
import { orderBy } from 'lodash'
import Dropdown from './Dropdown'
import { useSeasons } from '../../util/useSeasons'
import { defaultSeason } from '../../state/UIStore'
import { text } from '../../util/translate'

export type PropTypes = {
  label?: string | null
  className?: string
  value: Season | string
  onSelect: (season?: Season) => void
  selectInitialId?: string
  enableAll?: boolean
}

const SelectSeason: React.FC<PropTypes> = observer(
  ({ enableAll = false, onSelect, value = null, label, className, selectInitialId }) => {
    let unselectedVal = { ...defaultSeason }
    unselectedVal.id = enableAll ? text('all') : text('unselected')

    let seasonsData = useSeasons()

    const seasons: Season[] = useMemo(() => {
      // Most current seasons first
      const seasonsList: Season[] = orderBy(
        !seasonsData ? [] : [...seasonsData],
        ({ startDate }) => parseISO(startDate).getTime(),
        'desc'
      )

      // Add the unselected value to the top of the list
      if (seasonsList[0]?.id !== unselectedVal.id) {
        seasonsList.unshift(unselectedVal)
      }

      return seasonsList
    }, [seasonsData, value, unselectedVal])

    const onSelectSeason = useCallback(
      (selectedItem) => {
        let selectValue = selectedItem

        if (!selectedItem || (!enableAll && selectedItem?.id === unselectedVal.id)) {
          selectValue = unselectedVal
        }

        onSelect(selectValue)
      },
      [onSelect, enableAll, unselectedVal]
    )

    // Auto-select the first season if there is only one.
    useEffect(() => {
      let initialSeasonId = selectInitialId || (typeof value === 'string' ? value : '')
      let initialSeason = seasons.find((s) => s.id === initialSeasonId)

      // If no value or if we got a string value
      if ((!value || typeof value === 'string') && initialSeason) {
        onSelect(initialSeason)
      } else if (!value && !initialSeason && seasons.length !== 0) {
        onSelect(seasons.find((season) => !enableAll && season.id !== unselectedVal.id))
      }
    }, [value, seasons, unselectedVal, onSelect, selectInitialId, enableAll])

    const currentSeason = useMemo(() => {
      if (!!value && typeof value === 'string') {
        return seasons.find((s) => s.id === value)
      }

      return value || seasons[0] || unselectedVal
    }, [seasons, value, selectInitialId, unselectedVal])

    return (
      <Dropdown
        className={className}
        label={!label ? '' : label || text('season')}
        items={seasons}
        onSelect={onSelectSeason}
        selectedItem={currentSeason}
        itemToString="id"
        itemToLabel="id"
        unselectedValue={unselectedVal}
      />
    )
  }
)

export default SelectSeason
