import React, { useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ReportListItem as ReportListItemType } from '../schema-types'
import ExpandableBox from '../common/components/ExpandableBox'

const ReportListItemView = styled.div`
  padding: 1rem;
  border: 1px solid var(--lighter-grey);
  border-radius: 0.5rem;
  background: white;
`

const ReportTitle = styled.h3`
  margin-top: 0;
`

const ReportDescription = styled.p`
  margin-bottom: 0;
`

export type PropTypes = {
  reportItem: ReportListItemType
}

const ReportListItem: React.FC<PropTypes> = observer(({ reportItem }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <ReportListItemView>
      <ExpandableBox
        headerContent={
          <>
            <ReportTitle>{reportItem.name}</ReportTitle>
            <ReportDescription>{reportItem.description}</ReportDescription>
          </>
        }>
        Report here...
      </ExpandableBox>
    </ReportListItemView>
  )
})

export default ReportListItem
