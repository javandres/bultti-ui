import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../common/components/common'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import PreInspectionReports from '../preInspection/PreInspectionReports'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { usePreInspectionById } from '../preInspection/preInspectionUtils'
import { PageTitle } from '../common/components/Typography'

type PropTypes = {
  preInspectionId?: string
} & RouteComponentProps

const PreInspectionReportsPage: React.FC<PropTypes> = observer(({ preInspectionId }) => {
  let { data: preInspection, loading: inspectionLoading, refetch } = usePreInspectionById(
    preInspectionId
  )

  return (
    <Page>
      <PageTitle>
        Ennakkotarkastuksen raportit
        {!!preInspection && (
          <Button
            loading={inspectionLoading}
            style={{ marginLeft: 'auto' }}
            buttonStyle={ButtonStyle.SECONDARY}
            size={ButtonSize.SMALL}
            onClick={() => refetch()}>
            Päivitä
          </Button>
        )}
      </PageTitle>
      <PreInspectionContext.Provider value={preInspection}>
        <PreInspectionReports />
      </PreInspectionContext.Provider>
    </Page>
  )
})

export default PreInspectionReportsPage
