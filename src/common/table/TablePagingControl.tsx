import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Button, ButtonSize, ButtonStyle } from '../components/Button'
import Dropdown from '../input/Dropdown'
import { FlexRow } from '../components/common'
import { Text } from '../../util/translate'
import { TablePagingStateType } from './usePaging'

const PagingControlView = styled.div`
  padding: 0.75rem 1rem;
  margin: 0 -1rem;
`

const PagingElementsRow = styled(FlexRow)`
  justify-content: space-between;
  margin-top: 0.75rem;

  &:first-child {
    margin-top: 0;
  }
`

const PageElement = styled.div`
  flex: 1;
  margin: 0 1rem;
  display: flex;
  align-items: center;

  strong {
    margin-left: 0.4rem;
  }

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    justify-content: flex-end;
    margin-right: 0;
  }
`

const PageValue = styled(PageElement)`
  margin: 0 0.25rem;
`

const PagingWrapper = styled.div`
  margin-left: auto;
  text-align: right;
  width: auto;
  flex: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const PageSelectDropdown = styled(Dropdown)`
  margin-right: 0.25rem;
  flex: 1 1 available;
  justify-content: flex-end;

  button {
    padding: 0.5rem 0 0.5rem 0.75rem;
  }

  svg {
    margin-left: 0.75rem;
    margin-right: 0.5rem;
    flex: 0 1 1rem;
  }
`

const PageSelectorOption = styled.div`
  cursor: pointer;
  color: var(--blue);
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  &:last-child {
    margin-right: 0;
  }
`

let selectedPageOptionStyles = {
  color: 'var(--dark-grey)',
  cursor: 'default',
  fontWeight: 'bold' as 'bold',
}

export type PropTypes = {
  pageState: TablePagingStateType
  filteredCount?: number
  totalCount?: number
}

const TablePagingControl = observer(
  ({ pageState, totalCount = 0, filteredCount = totalCount }: PropTypes) => {
    let pageOptions = useMemo(() => {
      let opts: number[] = []
      let pageIdx = 1

      while (opts.length < (pageState.pageCount || 1)) {
        opts.push(pageIdx++)
      }

      return opts
    }, [pageState.pageCount])

    let setPageOffset = (offset: number) => () => pageState.setCurrentPageWithOffset(offset)

    let itemsOnPage = pageState.itemsOnPage
    let totalItemsCount = totalCount || pageState.itemsCount
    let filteredItemsCount = filteredCount || totalItemsCount

    return (
      <PagingControlView>
        {pageState.pageCount > 1 && pageState.pageSizeOptions.length !== 0 && (
          <PagingElementsRow>
            <PagingWrapper>
              <Button
                disabled={(pageState.currentPage || 1) <= 1}
                size={ButtonSize.SMALL}
                buttonStyle={ButtonStyle.SECONDARY}
                onClick={setPageOffset(-1)}>
                <Text>previous</Text>
              </Button>
              {pageState.pageCount > 1 && (
                <PageValue
                  style={{
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    minWidth: '8rem',
                    justifyContent: 'center',
                  }}>
                  <PageSelectDropdown
                    theme="light"
                    selectedItem={pageState.currentPage || 1}
                    items={pageOptions}
                    onSelect={(selectedPage) => pageState.setCurrentPage(selectedPage)}
                    itemToString={(idx) => idx}
                    itemToLabel={(idx) => idx}
                  />
                  <strong>/ {pageState.pageCount}</strong>
                </PageValue>
              )}
              <Button
                disabled={pageState.currentPage >= pageState.pageCount}
                size={ButtonSize.SMALL}
                buttonStyle={ButtonStyle.SECONDARY}
                onClick={setPageOffset(1)}>
                <Text>next</Text>
              </Button>
            </PagingWrapper>
            <PageElement style={{ justifyContent: 'flex-end', marginRight: 0 }}>
              <Text>table_rowsPerPage</Text>
              {pageState.pageSizeOptions.map((option: number, index: number) => {
                return (
                  <PageSelectorOption
                    key={`option-${index}`}
                    onClick={() => pageState.setPageSize(index)}
                    style={pageState.pageSize === option ? selectedPageOptionStyles : {}}>
                    {option}
                  </PageSelectorOption>
                )
              })}
            </PageElement>
          </PagingElementsRow>
        )}
        <PagingElementsRow>
          <PageElement>
            <Text>table_totalRows</Text> <strong>{totalItemsCount}</strong>
          </PageElement>
          {filteredItemsCount !== totalItemsCount && (
            <PageElement>
              <Text>table_filteredRows</Text> <strong>{filteredItemsCount}</strong>
            </PageElement>
          )}
          {itemsOnPage !== totalItemsCount && (
            <PageElement>
              <Text>table_rowsInView</Text> <strong>{itemsOnPage}</strong>
            </PageElement>
          )}
        </PagingElementsRow>
      </PagingControlView>
    )
  }
)

export default TablePagingControl
