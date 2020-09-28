import React from 'react'
import { observer } from 'mobx-react-lite'
import { Inspection } from '../schema-types'
import { ErrorView, MessageContainer } from '../common/components/Messages'
import { text } from '../util/translate'
import { groupBy } from 'lodash'

export type PropTypes = {
  inspection: Inspection
}

const InspectionValidationErrors = observer(({ inspection }: PropTypes) => {
  let deduplicatedErrors = Object.keys(groupBy(inspection?.inspectionErrors || [], 'type'))

  return (
    <MessageContainer>
      {deduplicatedErrors.map((err) => (
        <ErrorView key={err}>{text(err)}</ErrorView>
      ))}
    </MessageContainer>
  )
})

export default InspectionValidationErrors
