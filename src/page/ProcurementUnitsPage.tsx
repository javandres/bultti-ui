import React from 'react'
import styled from 'styled-components/macro'
import { Page, PageContainer } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import { useAppState } from '../state/useAppState'
import ProcurementUnits from '../procurementUnit/ProcurementUnits'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { PageTitle } from '../common/components/PageTitle'
import { addDays, parseISO } from 'date-fns'
import { getDateObject, getDateString } from '../util/formatDate'
import { Text } from '../util/translate'
import { RouteChildrenProps } from 'react-router-dom'

const ProcurementUnitsView = styled(Page)``

export type PropTypes = Record<string, unknown> & RouteChildrenProps

const ProcurementUnitsPage: React.FC<PropTypes> = observer(() => {
  const {
    state: { globalOperator, globalSeason },
  } = useAppState()

  return (
    <ProcurementUnitsView>
      <PageTitle>
        <Text>procurementUnits</Text>
      </PageTitle>
      <PageContainer>
        {!(globalOperator && globalSeason) ? (
          <MessageContainer>
            <MessageView>Valitse liikennöitsijä ja aikautaulukausi.</MessageView>
          </MessageContainer>
        ) : (
          <ProcurementUnits
            requirementsEditable={false}
            operatorId={globalOperator?.id || 0}
            startDate={globalSeason?.startDate || ''}
            endDate={globalSeason?.endDate || ''}
            contractSelectionDate={getDateObject(globalSeason.startDate)}
            isOnlyActiveCatalogueVisible={false}
          />
        )}
      </PageContainer>
    </ProcurementUnitsView>
  )
})

export default ProcurementUnitsPage
