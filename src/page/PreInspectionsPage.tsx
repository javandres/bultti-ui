import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../common/components/common'
import InspectionsList from '../inspection/InspectionsList'
import { Plus } from '../common/icon/Plus'
import { Button } from '../common/components/Button'
import { navigateWithQueryString } from '../util/urlValue'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { useFetchInspections } from '../inspection/inspectionUtils'
import { PageTitle } from '../common/components/PageTitle'
import { InspectionType } from '../schema-types'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const PreInspectionsPage: React.FC<PropTypes> = observer(() => {
  let [{ operator, inspections }, loading, refetch] = useFetchInspections(InspectionType.Pre)

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
        Ennakkotarkastukset
      </PageTitle>
      {!operator ? (
        <MessageContainer>
          <MessageView>Valitse liikennöitsijä.</MessageView>
        </MessageContainer>
      ) : (
        inspections.length !== 0 && (
          <InspectionsList
            inspections={inspections}
            inspectionType={InspectionType.Pre}
            loading={loading}
            onUpdate={refetch}
          />
        )
      )}
    </Page>
  )
})

export default PreInspectionsPage
