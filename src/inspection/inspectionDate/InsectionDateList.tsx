import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InspectionDate } from '../../schema-types'
import { Text } from '../../util/translate'
import { LoadingDisplay } from '../../common/components/Loading'

const Header = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`

const ListItem = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid var(--lighter-grey);
  &:last-of-type {
    border-bottom: none;
  }
`

interface PropTypes {
  inspectionDates: InspectionDate[]
  isLoading: boolean
}

const InspectionDateList: React.FC<PropTypes> = observer(({ inspectionDates, isLoading }) => {
  return (
    <>
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
                {inspectionDate.startDate} - {inspectionDate.endDate}
              </ListItem>
            )
          })}
        </>
      )}
    </>
  )
})

export default InspectionDateList
