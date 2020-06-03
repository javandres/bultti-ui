import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../common/components/common'
import PreInspectionsList from '../preInspection/PreInspectionsList'
import { Plus } from '../common/icon/Plus'
import { Button } from '../common/components/Button'
import { navigateWithQueryString } from '../util/urlValue'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { usePreInspections } from '../preInspection/inspectionUtils'
import { PageTitle } from '../common/components/Typography'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const PreInspectionsPage: React.FC<PropTypes> = observer(() => {
  let [{ operator, inspections }, loading, refetch] = usePreInspections()

  return (
    <Page>
      <PageTitle>
        Ennakkotarkastukset
        <Button onClick={() => navigateWithQueryString('pre-inspection/edit')}>
          <Plus fill="white" width="1rem" height="1rem" /> <span>Uusi ennakkotarkastus</span>
        </Button>
      </PageTitle>
      {!operator ? (
        <MessageContainer>
          <MessageView>Valitse liikennöitsijä.</MessageView>
        </MessageContainer>
      ) : (
        inspections.length !== 0 && (
          <PreInspectionsList inspections={inspections} loading={loading} onUpdate={refetch} />
        )
      )}
    </Page>
  )
})

export default PreInspectionsPage
