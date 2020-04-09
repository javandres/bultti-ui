import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps, useNavigate } from '@reach/router'
import { MessageContainer, MessageView, Page, PageTitle } from '../common/components/common'
import PreInspectionsList from '../preInspection/PreInspectionsList'
import { Plus } from '../common/icon/Plus'
import { useStateValue } from '../state/useAppState'
import { Button } from '../common/components/Button'
import { useQueryData } from '../util/useQueryData'
import { preInspectionsByOperatorQuery } from '../preInspection/preInspectionQueries'
import { PreInspection } from '../schema-types'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const PreInspections: React.FC<PropTypes> = observer(() => {
  var [operator] = useStateValue('globalOperator')
  var navigate = useNavigate()

  let { data: preInspectionsData, loading, refetch } = useQueryData<PreInspection>(
    preInspectionsByOperatorQuery,
    {
      skip: !operator,
      notifyOnNetworkStatusChange: true,
      variables: {
        operatorId: operator?.operatorId,
      },
    }
  )

  let preInspections =
    !!preInspectionsData && Array.isArray(preInspectionsData) ? preInspectionsData : []

  return (
    <Page>
      <PageTitle>
        Ennakkotarkastukset
        <Button onClick={() => navigate('pre-inspection/edit')}>
          <Plus fill="white" width="1rem" height="1rem" /> <span>Uusi ennakkotarkastus</span>
        </Button>
      </PageTitle>
      {!operator ? (
        <MessageContainer>
          <MessageView>Valitse liikennöitsijä.</MessageView>
        </MessageContainer>
      ) : (
        preInspections.length !== 0 && (
          <PreInspectionsList
            preInspections={preInspections}
            loading={loading}
            onUpdate={refetch}
          />
        )
      )}
    </Page>
  )
})

export default PreInspections
