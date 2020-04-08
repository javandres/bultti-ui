import React, { useCallback, useState } from 'react'
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
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useMutationData } from '../util/useMutationData'
import { publishPreInspectionMutation } from '../preInspection/preInspectionQueries'

const CreatePreInspectionView = styled(Page)``

export type PropTypes = {} & RouteComponentProps

const CreatePreInspection: React.FC<PropTypes> = observer(() => {
  var [currentPreInspection, setCurrentPreInspection] = useState<PreInspection | null>(null)

  var [season] = useStateValue('globalSeason')
  var [operator] = useStateValue('globalOperator')

  let onReset = useCallback(() => setCurrentPreInspection(null), [])

  let [publishPreInspection] = useMutationData(
    publishPreInspectionMutation
  )

  let onPublish = useCallback(async () => {
    if (currentPreInspection) {
      await publishPreInspection({
        variables: {
          preInspectionId: currentPreInspection.id,
        },
      })

      onReset()
    }
  }, [publishPreInspection, currentPreInspection, onReset])

  return (
    <CreatePreInspectionView>
      <PreInspectionContext.Provider value={currentPreInspection}>
        {!currentPreInspection ? (
          <>
            <PageTitle>Ennakkotarkastukset</PageTitle>
            <SelectPreInspection
              operator={operator}
              season={season}
              onSelect={setCurrentPreInspection}
              currentPreInspection={currentPreInspection}
            />
          </>
        ) : (
          <>
            <PageTitle>
              Uusi ennakkotarkastus
              <Button
                style={{ marginLeft: 'auto' }}
                size={ButtonSize.MEDIUM}
                buttonStyle={ButtonStyle.SECONDARY_REMOVE}
                onClick={onReset}>
                Peruuta
              </Button>
            </PageTitle>
            <Tabs>
              <PreInspectionForm name="new" path="/" label="Luo" />
              <PreviewPreInspection path="preview" name="preview" label="Esikatsele" onPublish={onPublish} />
            </Tabs>
          </>
        )}
      </PreInspectionContext.Provider>
    </CreatePreInspectionView>
  )
})

export default CreatePreInspection
