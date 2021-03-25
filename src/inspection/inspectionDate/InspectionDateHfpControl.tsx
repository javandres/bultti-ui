import React, { useCallback } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { PageSection } from '../../common/components/common'
import { InputLabel } from '../../common/components/form'
import { gql } from '@apollo/client'
import { useMutationData } from '../../util/useMutationData'
import { HfpStatus, InspectionDate } from '../../schema-types'
import { text, Text } from '../../util/translate'
import { useHasAdminAccessRights } from '../../util/userRoles'
import { Button, ButtonSize } from '../../common/components/buttons/Button'

const LoadInspectionHfpDataView = styled(PageSection)`
  margin: 1rem;
  padding: 1rem;
  width: auto;
`

const LoadButton = styled(Button)`
  width: auto;
  flex: 0;
`

const loadHfpDataMutation = gql`
  mutation loadHfpDataForInspectionPeriod($inspectionDateId: String!) {
    loadHfpDataForInspectionPeriod(inspectionDateId: $inspectionDateId) {
      status
      date
    }
  }
`

type PropTypes = {
  inspectionDate: InspectionDate
}

const InspectionDateHfpControl = observer(({ inspectionDate }: PropTypes) => {
  let hfpMissing = inspectionDate.hfpDataStatus !== HfpStatus.Ready
  let hfpLoading = inspectionDate.hfpDataStatus === HfpStatus.Loading

  let [loadHfpData, { loading: hfpDataLoading }] = useMutationData(loadHfpDataMutation)

  let onClickLoad = useCallback(() => {
    loadHfpData({
      variables: {
        inspectionDateId: inspectionDate.id,
      },
    })
  }, [inspectionDate])

  let canLoadHfpManually = useHasAdminAccessRights()

  return (
    <LoadInspectionHfpDataView>
      <InputLabel>
        <Text>inspectionDate_hfpPanel_title</Text>
      </InputLabel>
      {canLoadHfpManually && (
        <LoadButton
          loading={hfpDataLoading}
          size={ButtonSize.LARGE}
          onClick={onClickLoad}
          disabled={hfpLoading}>
          {hfpLoading
            ? text('inspectionDate_hfpPanel_loadingDates')
            : !hfpMissing
            ? text('inspectionDate_hfpPanel_datesLoaded')
            : text('inspectionDate_hfpPanel_loadHfpForDates')}
        </LoadButton>
      )}
    </LoadInspectionHfpDataView>
  )
})

export default InspectionDateHfpControl
