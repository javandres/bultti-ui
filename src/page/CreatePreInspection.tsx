import React, { useCallback } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import PreInspectionForm from '../preInspection/PreInspectionForm'
import { Page, PageTitle } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import Tabs from '../common/components/Tabs'
import { useQueryData } from '../util/useQueryData'
import { preInspectionQuery } from '../preInspection/preInspectionQueries'
import { useStateValue } from '../state/useAppState'
import { PreInspection } from '../schema-types'
import PreviewPreInspection from '../preInspection/PreviewPreInspection'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'

const CreatePreInspectionView = styled(Page)``

export type PropTypes = {} & RouteComponentProps

const CreatePreInspection: React.FC<PropTypes> = observer(() => {
  var [season] = useStateValue('globalSeason')
  var [operator] = useStateValue('globalOperator')

  let { data: preInspection, loading, refetch } = useQueryData<PreInspection>(preInspectionQuery, {
    skip: !operator || !season,
    notifyOnNetworkStatusChange: true,
    variables: {
      operatorId: operator?.id,
      seasonId: season?.id,
    },
  })

  let onPreInspectionChange = useCallback(async (): Promise<unknown> => {
    if (refetch) {
      return refetch()
    }

    return
  }, [refetch])

  return (
    <PreInspectionContext.Provider value={preInspection || null}>
      <CreatePreInspectionView>
        <PageTitle>Uusi ennakkotarkastus</PageTitle>
        <Tabs>
          <PreInspectionForm
            name="new"
            path="/"
            label="Luo"
            preInspection={preInspection || null}
            loading={loading}
            onPreInspectionChange={onPreInspectionChange}
          />
          <PreviewPreInspection path="preview" name="preview" label="Esikatsele" />
        </Tabs>
      </CreatePreInspectionView>
    </PreInspectionContext.Provider>
  )
})

export default CreatePreInspection
