import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useQueryData } from '../utils/useQueryData'
import gql from 'graphql-tag'
import { text } from '../utils/translate'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import { useSelect } from 'downshift'
import { Button, ButtonSize } from './Button'
import { Operator } from '../schema-types'

const vehiclesQuery = gql`
  query listOperators {
    operators {
      id
      name
    }
  }
`

const OperatorFilterView = styled.div``

const InputLabel = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #eeeeee;
  margin: 2rem 0 0;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  border-bottom: 1px solid var(--dark-blue);
`

const SelectWrapper = styled.div`
  padding: 1rem;
  position: relative;
`

const SelectButton = styled(Button).attrs({ size: ButtonSize.MEDIUM })`
  background: white;
  color: var(--dark-grey);
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 0;
`

const SuggestionsList = styled.ul`
  list-style: none;
  width: calc(100% - 2rem);
  border-radius: 10px;
  background: white;
  max-height: 250px;
  overflow-y: auto;
  position: absolute;
  top: 0;
  left: 1rem;
  padding: 0;
`

const OperatorSuggestion = styled.li<{ highlighted: boolean }>`
  color: ${(p) => (p.highlighted ? 'white' : 'var(--dark-grey)')};
  cursor: pointer;
  padding: 0.5rem;
  background: ${(p) => (p.highlighted ? 'var(--dark-blue)' : 'transparent')};
`

const OperatorFilter = observer(() => {
  const [operator, setOperatorFilter] = useStateValue('globalOperator')
  const { data } = useQueryData({ query: vehiclesQuery })

  const operators: Operator[] = useMemo(() => {
    const operatorList = data || []
    operatorList.unshift({ id: 'all', name: text('general.app.all') })
    return operatorList
  }, [data])

  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect<Operator>({
    items: operators,
    onSelectedItemChange: ({ selectedItem }) => setOperatorFilter(selectedItem || null),
    selectedItem: !operator
      ? operators[0]
      : operators.find((op) => operator.id === op.id) || operators[0],
    defaultSelectedItem: operators[0],
    itemToString: (item: any) => (item ? item?.name : ''),
  })

  return (
    <OperatorFilterView>
      <InputLabel {...getLabelProps()}>Valitse liikennöitsijä</InputLabel>
      <SelectWrapper>
        <SelectButton {...getToggleButtonProps()}>
          {selectedItem.name || text('general.app.all')}
        </SelectButton>
        <SuggestionsList {...getMenuProps()}>
          {isOpen
            ? operators.map((item, index) => (
                <OperatorSuggestion
                  highlighted={highlightedIndex === index}
                  {...getItemProps({
                    key: item.id,
                    index,
                    item,
                  })}>
                  {item.name}
                </OperatorSuggestion>
              ))
            : null}
        </SuggestionsList>
      </SelectWrapper>
    </OperatorFilterView>
  )
})

export default OperatorFilter
