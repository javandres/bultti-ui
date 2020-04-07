import React, { useState } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import PreInspectionForm from '../preInspection/PreInspectionForm'
import { Page, PageTitle } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import Tabs from '../common/components/Tabs'
import { useStateValue } from '../state/useAppState'
import { PreInspection } from '../schema-types'
import PreviewPreInspection from '../preInspection/PreviewPreInspection'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import SelectPreInspection from '../preInspection/SelectPreInspection'

const CreatePreInspectionView = styled(Page)``

export type PropTypes = {} & RouteComponentProps

const CreatePreInspection: React.FC<PropTypes> = observer(() => {
  var [currentPreInspection, setCurrentPreInspection] = useState<PreInspection | null>(null)

  var [season] = useStateValue('globalSeason')
  var [operator] = useStateValue('globalOperator')

  return (
    <CreatePreInspectionView>
      <PreInspectionContext.Provider value={currentPreInspection}>
        {!currentPreInspection ? (
          <SelectPreInspection
            operator={operator}
            season={season}
            onSelect={setCurrentPreInspection}
            currentPreInspection={currentPreInspection}
          />
        ) : (
          <>
            <PageTitle>Uusi ennakkotarkastus</PageTitle>
            <Tabs>
              <PreInspectionForm name="new" path="/" label="Luo" />
              <PreviewPreInspection path="preview" name="preview" label="Esikatsele" />
            </Tabs>
          </>
        )}
      </PreInspectionContext.Provider>
    </CreatePreInspectionView>
  )
})

export default CreatePreInspection
