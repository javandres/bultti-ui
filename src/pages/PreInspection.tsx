import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page, PageSection, PageTitle } from '../components/common'
import FunctionBar from '../components/FunctionBar'
import CurrentPreInspections from '../components/CurrentPreInspections'
import AllPreInspections from '../components/AllPreInspections'
import { Plus } from '../icons/Plus'
import { useStateValue } from '../state/useAppState'
import preinspections from '../data/preinspections.json'
import { Text } from '../utils/translate'
import styled from 'styled-components'

const OperatorTitle = styled.h3`
  margin-left: 1.5rem;
`

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const PreInspection: React.FC<PropTypes> = observer(() => {
  const [globalOperator] = useStateValue('globalOperator')
  const data = !!preinspections && Array.isArray(preinspections) ? preinspections : []
  const operatorPreInspections = !globalOperator
    ? data
    : data.filter((inspection) => inspection.operatorId === globalOperator.id)

  return (
    <Page>
      <FunctionBar
        functions={[
          {
            name: 'Uusi ennakkotarkastus',
            label: (
              <>
                <Plus fill="white" width="1rem" height="1rem" />{' '}
                <span>Uusi ennakkotarkastus</span>
              </>
            ),
            path: 'preinspection/create',
          },
        ]}
      />
      <PageTitle>Ennakkotarkastus</PageTitle>
      <OperatorTitle>
        {globalOperator ? globalOperator.name : <Text>domain.all.operators</Text>}
      </OperatorTitle>
      <PageSection>
        <CurrentPreInspections
          operator={globalOperator}
          preInspections={operatorPreInspections}
        />
      </PageSection>
      <PageSection>
        <AllPreInspections preInspections={operatorPreInspections} />
      </PageSection>
    </Page>
  )
})

export default PreInspection
