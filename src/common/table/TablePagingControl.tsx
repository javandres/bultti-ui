import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Button, ButtonSize, ButtonStyle } from '../components/Button'
import Dropdown from '../input/Dropdown'
import { PageState } from './tableUtils'
import { pageSizeOptions, SetCurrentPagePropTypes } from './useTableState'
import { FlexRow } from '../components/common'
import { Text } from '../../util/translate'

const PagingControlView = styled.div`
  padding: 0.5rem 1rem;
  margin: 0 -1rem;
`

const PagingElementsRow = styled(FlexRow)`
  justify-content: space-between;
  margin-top: 1rem;

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
  pageState: PageState
  onSetPage: (props: SetCurrentPagePropTypes) => unknown
  onSetPageSize: (targetPageSize: number) => unknown
  pageSize: number
}

const TablePagingControl = observer(
  ({ pageState, onSetPage, onSetPageSize, pageSize = pageSizeOptions[0] }: PropTypes) => {
    let pageOptions = useMemo(() => {
      let opts: number[] = []
      let pageIdx = 1

      while (opts.length < (pageState.pages || 1)) {
        opts.push(pageIdx++)
      }

      return opts
    }, [pageState.pages])

    let setPageOffset = useCallback(
      (offset: number) => () => onSetPage({ offset, maxPages: pageState.pages }),
      [onSetPage]
    )

    return (
      <PagingControlView>
        <PagingElementsRow>
          <PageElement>
            <Text>table_totalRows</Text> <strong>{pageState.totalCount}</strong>
          </PageElement>
          {pageState.filteredCount !== pageState.totalCount && (
            <PageElement>
              <Text>table_filteredRows</Text> <strong>{pageState.filteredCount}</strong>
            </PageElement>
          )}
          {pageState.pageSize !== pageState.totalCount && (
            <PageElement>
              <Text>table_rowsInView</Text> <strong>{pageState.itemsOnPage}</strong>
            </PageElement>
          )}
          <PagingWrapper>
            <Button
              disabled={(pageState.currentPage || 1) <= 1}
              size={ButtonSize.SMALL}
              buttonStyle={ButtonStyle.SECONDARY}
              onClick={setPageOffset(-1)}>
              {'<'}
            </Button>
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
                onSelect={(selectedPage) =>
                  onSetPage({ setToPage: selectedPage, maxPages: pageState.pages })
                }
                itemToString={(idx) => idx}
                itemToLabel={(idx) => idx}
              />
              <strong>/ {pageState.pages}</strong>
            </PageValue>
            <Button
              disabled={!((pageState.currentPage || 1) < (pageState.pages || 1))}
              size={ButtonSize.SMALL}
              buttonStyle={ButtonStyle.SECONDARY}
              onClick={setPageOffset(1)}>
              {'>'}
            </Button>
          </PagingWrapper>
        </PagingElementsRow>
        <PagingElementsRow style={{ justifyContent: 'flex-end' }}>
          <PageElement style={{ justifyContent: 'flex-end', marginRight: 0 }}>
            <Text>table_rowsPerPage</Text>
            {pageSizeOptions.map((option: number, index: number) => {
              return (
                <PageSelectorOption
                  key={`option-${index}`}
                  onClick={() => onSetPageSize(index)}
                  style={pageSize === option ? selectedPageOptionStyles : {}}>
                  {option}
                </PageSelectorOption>
              )
            })}
          </PageElement>
        </PagingElementsRow>
      </PagingControlView>
    )
  }
)

export default TablePagingControl
