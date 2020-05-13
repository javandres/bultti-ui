import React, { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../../state/useAppState'
import { SidebarStyledSelect } from './AppSidebar'
import SelectSeason from '../input/SelectSeason'
import { getUrlValue } from '../../util/urlValue'

const GlobalSeasonFilter: React.FC = observer(() => {
  const [season, setSeasonFilter] = useStateValue('globalSeason')

  let initialSeasonId: string | undefined = useMemo(() => {
    let initialVal = (getUrlValue('season') || '') + ''
    return initialVal || undefined
  }, [])

  return (
    <SidebarStyledSelect
      as={SelectSeason}
      onSelect={setSeasonFilter}
      value={season}
      label="Valitse kausi"
      theme="dark"
      selectInitialId={initialSeasonId}
    />
  )
})

export default GlobalSeasonFilter
