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
  inspectionId?: string
} & RouteComponentProps

const PreInspectionReportsPage: React.FC<PropTypes> = observer(({ inspectionId }) => {
  let { data: inspection, loading: inspectionLoading, refetch } = usePreInspectionById(
    inspectionId
  )

  return (
    <Page>
      <PageTitle>
        Ennakkotarkastuksen raportit
        {!!inspection && (
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
      <PreInspectionContext.Provider value={inspection}>
        <PreInspectionReports />
      </PreInspectionContext.Provider>
    </Page>
  )
})

export default PreInspectionReportsPage
