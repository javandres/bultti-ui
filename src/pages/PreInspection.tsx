import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page, PageSection, PageTitle } from '../components/common'
import FunctionBar from '../components/FunctionBar'
import CurrentPreInspections from '../components/CurrentPreInspections'
import AllPreInspections from '../components/AllPreInspections'
import { Plus } from '../icons/Plus'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const PreInspection: React.FC<PropTypes> = observer((props) => {
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
            action: () => {},
          },
        ]}
      />
      <PageTitle>Ennakkotarkastus</PageTitle>
      <PageSection>
        <CurrentPreInspections />
      </PageSection>
      <PageSection>
        <AllPreInspections />
      </PageSection>
    </Page>
  )
})

export default PreInspection
