import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InspectionDate } from '../../schema-types'
import { Text } from '../../util/translate'
import { LoadingDisplay } from '../../common/components/Loading'
import DateRangeDisplay from '../../common/components/DateRangeDisplay'

const Header = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`

const ListWrapper = styled.div`
  margin: 0 0 0.5rem;
`

const ListItem = styled.div`
  margin: 0 -1rem;
  padding: 0.5rem 1rem;

  &:nth-child(even) {
    background: var(--white-grey);
  }
`

interface PropTypes {
  inspectionDates: InspectionDate[]
  isLoading: boolean
}

const InspectionDateList: React.FC<PropTypes> = observer(({ inspectionDates, isLoading }) => {
  return (
    <ListWrapper>
      <Header>
        <Text>inspection_date.list.header</Text>
      </Header>
      {isLoading ? (
        <LoadingDisplay />
      ) : (
        <>
          {inspectionDates.length === 0 && <Text>inspection_date.list.noResults</Text>}
          {inspectionDates.map((inspectionDate: InspectionDate, index: number) => {
            return (
              <ListItem key={index}>
                <DateRangeDisplay
                  startDate={inspectionDate.startDate}
                  endDate={inspectionDate.endDate}
                />
              </ListItem>
            )
          })}
        </>
      )}
    </ListWrapper>
  )
})

export default InspectionDateList
