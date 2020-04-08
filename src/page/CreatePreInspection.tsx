import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import EditPreInspection from '../preInspection/EditPreInspection'
import { Page, PageTitle } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import Tabs from '../common/components/Tabs'
import { useStateValue } from '../state/useAppState'
import { InspectionStatus, PreInspection } from '../schema-types'
import PreviewPreInspection from '../preInspection/PreviewPreInspection'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import SelectPreInspection from '../preInspection/SelectPreInspection'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useMutationData } from '../util/useMutationData'
import {
  currentPreInspectionsByOperatorAndSeasonQuery,
  publishPreInspectionMutation,
} from '../preInspection/preInspectionQueries'
import { useQueryData } from '../util/useQueryData'

const CreatePreInspectionView = styled(Page)``

export type PropTypes = {} & RouteComponentProps

const CreatePreInspection: React.FC<PropTypes> = observer(() => {
  var [currentPreInspection, setCurrentPreInspection] = useState<PreInspection | null>(null)

  var [season] = useStateValue('globalSeason')
  var [operator] = useStateValue('globalOperator')

  let { data: preInspections, loading, refetch } = useQueryData<PreInspection>(
    currentPreInspectionsByOperatorAndSeasonQuery,
    {
      skip: !operator || !season,
      notifyOnNetworkStatusChange: true,
      variables: {
        operatorId: operator?.id,
        seasonId: season?.id,
      },
    }
  )

  let onReset = useCallback(() => {
    setCurrentPreInspection(null)
    refetch()
  }, [refetch])

  let [publishPreInspection] = useMutationData(publishPreInspectionMutation)

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

  // If there is a draft, select it as the current pre-inspection.
  // This immediately opens the pre-inspection edit view.
  useEffect(() => {
    if (preInspections && preInspections.length !== 0) {
      let draft = preInspections.find((pi) => pi.status === InspectionStatus.Draft)

      if (draft) {
        setCurrentPreInspection(draft)
      }
    }
  }, [preInspections])

  return (
    <CreatePreInspectionView>
      <PreInspectionContext.Provider value={currentPreInspection}>
        {!currentPreInspection ? (
          <>
            <PageTitle>Valitse ennakkotarkastus muokattavaksi</PageTitle>
            <SelectPreInspection
              preInspections={preInspections}
              refetchPreInspections={refetch}
              loading={loading}
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
              <EditPreInspection name="new" path="/" label="Luo" />
              <PreviewPreInspection
                path="preview"
                name="preview"
                label="Esikatsele"
                onPublish={onPublish}
              />
            </Tabs>
          </>
        )}
      </PreInspectionContext.Provider>
    </CreatePreInspectionView>
  )
})

export default CreatePreInspection
