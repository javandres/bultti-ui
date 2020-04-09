import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import { MessageContainer, MessageView, Page, PageTitle } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import { useAppState } from '../state/useAppState'
import ProcurementUnits from '../procurementUnit/ProcurementUnits'

const ProcurementUnitsView = styled(Page)``

const Content = styled.div`
  padding: 0 1rem;
`

export type PropTypes = {} & RouteComponentProps

const ProcurementUnitsPage: React.FC<PropTypes> = observer(() => {
  const {
    state: { globalOperator, globalSeason },
  } = useAppState()

  return (
    <ProcurementUnitsView>
      <PageTitle>Kilpailukohteet</PageTitle>
      {!(globalOperator && globalSeason && typeof globalSeason !== 'string') ? (
        <MessageContainer>
          <MessageView>Valitse liikennöitsijä ja aikautaulukausi.</MessageView>
        </MessageContainer>
      ) : (
        <Content>
          <ProcurementUnits
            operatorId={globalOperator?.id || 0}
            startDate={globalSeason?.startDate || ''}
          />
        </Content>
      )}
    </ProcurementUnitsView>
  )
})

export default ProcurementUnitsPage
