import React, { useCallback, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Season } from '../../schema-types'
import { parseISO } from 'date-fns'
import { orderBy } from 'lodash'
import Dropdown from './Dropdown'
import { useSeasons } from '../../util/useSeasons'
import { unselectedSeason } from '../../state/UIStore'
import { text } from '../../util/translate'

export type PropTypes = {
  label?: string | null
  className?: string
  value: Season
  onSelect: (season?: Season) => void
  selectInitialId?: string
  enableAll?: boolean
}

export function seasonIsValid(season: Season | null | undefined) {
  return season && season.id !== unselectedSeason.id
}

const SelectSeason: React.FC<PropTypes> = observer(
  ({ enableAll = false, onSelect, value = null, label, className, selectInitialId }) => {
    let unselectedVal = { ...unselectedSeason }
    unselectedVal.id = enableAll ? text('all') : text('unselected')

    let seasonsData = useSeasons()

    const seasons: Season[] = useMemo(() => {
      // Most current seasons first
      const seasonsList: Season[] = orderBy(
        !seasonsData ? [] : [...seasonsData],
        ({ startDate }) => parseISO(startDate).getTime(),
        'desc'
      )

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
      // Get the season matching the initialId value or the value string as a proper object.
      let initialSeason = seasons.find((s) => s.id === selectInitialId)

      // Value is empty when it is falsy or when the value.id matches the unselected season object id.
      let valueIsEmpty = !value || value.id === unselectedVal.id
      // If no value, or if we got a string value, or if the value is the "unselected" object,
      // set the initial season if we've got one.
      let setProvidedInitialSeason = initialSeason && valueIsEmpty

      if (setProvidedInitialSeason) {
        onSelect(initialSeason)
      } else if (seasons.length !== 0 && valueIsEmpty) {
        // If no initial season and no actual value already, set the first actual season from the options.
        onSelect(seasons.find((season) => !enableAll && season.id !== unselectedVal.id))
      }
    }, [value, seasons, unselectedVal, onSelect, selectInitialId, enableAll])

    // The currently selected season.
    const currentSeason = useMemo(() => {
      // Find the season object if the value is a string
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
