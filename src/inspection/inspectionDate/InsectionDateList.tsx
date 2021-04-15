import React, { useState } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { InspectionDate } from '../../schema-types'
import { text, Text } from '../../util/translate'
import { RemoveButton } from '../../common/components/buttons/Button'
import { LoadingDisplay } from '../../common/components/Loading'
import { useMutationData } from '../../util/useMutationData'
import { removeInspectionDateMutation } from './inspectionDateQuery'
import DateRangeDisplay from '../../common/components/DateRangeDisplay'
import { MessageView } from '../../common/components/Messages'
import { getHfpStatusColor, HfpStatusIndicator } from '../../common/components/HfpStatus'
import InspectionDateHfpControl from './InspectionDateHfpControl'

const Header = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`

const ListWrapper = styled.div`
  margin: 0 0 1rem;
`

const ListItem = styled.div`
  margin: 0 -1rem;
  overflow: auto;

  &:nth-child(odd) {
    background: var(--white-grey);
  }
`

const ListItemHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
`

const DateHfpStatus = styled(HfpStatusIndicator)`
  margin-left: auto;
  margin-right: 2rem;
  background: transparent;
  border: 0;
  color: var(--grey);
  font-family: inherit;
  padding: 0.5rem 0.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.1s ease-out;
  outline: none;

  &:hover {
    background: var(--lightest-grey);
  }
`

type ListItemProps = {
  inspectionDate: InspectionDate
  removeItem: (inspectionDate: InspectionDate) => unknown
}

const InspectionDateListItem: React.FC<ListItemProps> = ({ inspectionDate, removeItem }) => {
  let [hfpPanelIsOpen, setHfpPanelIsOpen] = useState(false)

  return (
    <ListItem>
      <ListItemHeader>
        <DateRangeDisplay
          startDate={inspectionDate.startDate}
          endDate={inspectionDate.endDate}
        />
        {inspectionDate.hfpDataStatus && (
          <DateHfpStatus
            onClick={() => setHfpPanelIsOpen((isOpen) => !isOpen)}
            as={'button'}
            color={getHfpStatusColor(inspectionDate.hfpDataStatus)}>
            {text(`inspectionDate_hfp_${inspectionDate.hfpDataStatus.toLowerCase()}`)}
          </DateHfpStatus>
        )}
        <RemoveButton onClick={() => removeItem(inspectionDate)} />
      </ListItemHeader>
      {hfpPanelIsOpen && <InspectionDateHfpControl inspectionDate={inspectionDate} />}
    </ListItem>
  )
}

interface PropTypes {
  inspectionDates: InspectionDate[]
  isLoading: boolean
  refetchInspectionDateList: () => unknown
}

const InspectionDateList: React.FC<PropTypes> = observer(
  ({ inspectionDates, isLoading, refetchInspectionDateList }) => {
    let [removeInspectionDate] = useMutationData(removeInspectionDateMutation)

    let removeItem = async (inspectionDate: InspectionDate) => {
      // TODO: validate that inspection date is not being used at Inspections
      // or even better: don't display remove button if you cannot remove due to that reason ^
      if (
        confirm(
          `Haluatko varmasti poistaa tarkistuspäivämäärän ${inspectionDate.startDate} - ${inspectionDate.endDate}`
        )
      ) {
        await removeInspectionDate({
          variables: {
            id: inspectionDate.id,
          },
        })

        refetchInspectionDateList()
      }
    }

    return (
      <ListWrapper>
        <Header>
          <Text>inspectionDateList_header</Text>
        </Header>
        <LoadingDisplay loading={isLoading} />
        {!isLoading && inspectionDates.length === 0 && (
          <MessageView>
            <Text>inspectionDateList_noResults</Text>
          </MessageView>
        )}
        <div>
          {inspectionDates.map((inspectionDate: InspectionDate) => (
            <InspectionDateListItem
              key={inspectionDate.id}
              removeItem={removeItem}
              inspectionDate={inspectionDate}
            />
          ))}
        </div>
      </ListWrapper>
    )
  }
)

export default InspectionDateList
