import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../../state/useAppState'
import styled from 'styled-components'
import SelectSeason from '../inputs/SelectSeason'

const SeasonSelect = styled(SelectSeason)`
  > label {
    margin-left: 1rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid #bbb;
  }

  > div {
    padding: 0 1rem 1rem;
  }

  ul {
    left: 1rem;
    width: calc(100% - 2rem);
  }
`

const GlobalSeasonFilter: React.FC = observer(() => {
  const [season, setSeasonFilter] = useStateValue('globalSeason')

  return (
    <SeasonSelect onSelect={setSeasonFilter} value={season} label="Valitse kausi" theme="dark" />
  )
})

export default GlobalSeasonFilter
