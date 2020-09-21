import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../common/components/common'
import { usePreInspections } from '../inspection/inspectionUtils'
import { PageTitle } from '../common/components/PageTitle'
import { Button } from '../common/components/Button'
import { navigateWithQueryString } from '../util/urlValue'
import { Plus } from '../common/icon/Plus'
import { MessageContainer, MessageView } from '../common/components/Messages'
import InspectionsList from '../inspection/InspectionsList'
import { InspectionType } from '../schema-types'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const PostInspectionsPage: React.FC<PropTypes> = observer((props) => {
  let [{ operator, inspections }, loading, refetch] = usePreInspections()

  return (
    <Page>
      <PageTitle
        loading={loading}
        onRefresh={refetch}
        headerButtons={
          <Button onClick={() => navigateWithQueryString('pre-inspection/edit')}>
            <Plus fill="white" width="1rem" height="1rem" /> <span>Uusi ennakkotarkastus</span>
          </Button>
        }>
        Jälkitarkastukset
      </PageTitle>
      {!operator ? (
        <MessageContainer>
          <MessageView>Valitse liikennöitsijä.</MessageView>
        </MessageContainer>
      ) : (
        inspections.length !== 0 && (
          <InspectionsList
            inspections={inspections}
            inspectionType={InspectionType.Post}
            loading={loading}
            onUpdate={refetch}
          />
        )
      )}
    </Page>
  )
})

export default PostInspectionsPage
