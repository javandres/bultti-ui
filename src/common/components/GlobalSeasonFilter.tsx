import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../../state/useAppState'
import { SidebarStyledSelect } from './AppSidebar'
import SelectSeason from '../input/SelectSeason'

const GlobalSeasonFilter: React.FC = observer(() => {
  const [season, setSeasonFilter] = useStateValue('globalSeason')

  return (
    <SidebarStyledSelect
      as={SelectSeason}
      onSelect={setSeasonFilter}
      value={season}
      label="Valitse kausi"
      theme="dark"
    />
  )
})

export default GlobalSeasonFilter
