import React from 'react'
import styled from 'styled-components/macro'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import { useAppState } from '../state/useAppState'
import ProcurementUnits from '../procurementUnit/ProcurementUnits'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { PageTitle } from '../common/components/PageTitle'
import { addDays, parseISO } from 'date-fns'
import { getDateString } from '../util/formatDate'

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
            requirementsEditable={false}
            operatorId={globalOperator?.id || 0}
            startDate={globalSeason?.startDate || ''}
            endDate={
              globalSeason?.startDate
                ? getDateString(addDays(parseISO(globalSeason.startDate), 7))
                : ''
            }
          />
        </Content>
      )}
    </ProcurementUnitsView>
  )
})

export default ProcurementUnitsPage
