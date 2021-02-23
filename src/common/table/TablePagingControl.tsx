import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Button, ButtonSize, ButtonStyle } from '../components/Button'
import Dropdown from '../input/Dropdown'
import { PageMeta } from './tableUtils'
import { defaultPageConfig, pageSizeOptions, SetCurrentPagePropTypes } from './useTableState'
import { FlexRow } from '../components/common'
import { Text } from '../../util/translate'
import { PageConfig } from '../../schema-types'

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
  pageState: PageConfig
  onSetPage: (props: SetCurrentPagePropTypes) => unknown
  onSetPageSize: (targetPageSize: number) => unknown
  pageMeta?: PageMeta
}

const TablePagingControl = observer(
  ({ pageMeta, onSetPage, onSetPageSize, pageState = defaultPageConfig }: PropTypes) => {
    let pageOptions = useMemo(() => {
      let opts: number[] = []
      let pageIdx = 1

      while (opts.length < (pageMeta?.pages || 1)) {
        opts.push(pageIdx++)
      }

      return opts
    }, [pageMeta?.pages])

    let setPageOffset = useCallback(
      (offset: number) => () => onSetPage({ offset, maxPages: pageMeta?.pages }),
      [onSetPage]
    )

    let visiblePageSizeOptions = pageSizeOptions.filter(
      (opt) => (pageMeta?.totalCount || 0) >= opt
    )

    return (
      <PagingControlView>
        <PagingElementsRow>
          <PagingWrapper>
            <Button
              disabled={(pageState.page || 1) <= 1}
              size={ButtonSize.SMALL}
              buttonStyle={ButtonStyle.SECONDARY}
              onClick={setPageOffset(-1)}>
              <Text>previous</Text>
            </Button>
            {pageMeta ? (
              <PageValue
                style={{
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  minWidth: '8rem',
                  justifyContent: 'center',
                }}>
                <PageSelectDropdown
                  theme="light"
                  selectedItem={pageState.page || 1}
                  items={pageOptions}
                  onSelect={(selectedPage) =>
                    onSetPage({ setToPage: selectedPage, maxPages: pageMeta.pages })
                  }
                  itemToString={(idx) => idx}
                  itemToLabel={(idx) => idx}
                />
                <strong>/ {pageMeta.pages}</strong>
              </PageValue>
            ) : (
              <PageValue>
                <strong>{pageState.page}</strong>
              </PageValue>
            )}
            <Button
              disabled={!pageMeta ? false : !((pageState.page || 1) < (pageMeta.pages || 1))}
              size={ButtonSize.SMALL}
              buttonStyle={ButtonStyle.SECONDARY}
              onClick={setPageOffset(1)}>
              <Text>next</Text>
            </Button>
          </PagingWrapper>
          <PageElement style={{ justifyContent: 'flex-end', marginRight: 0 }}>
            <Text>table_rowsPerPage</Text>
            {visiblePageSizeOptions.map((option: number, index: number) => {
              return (
                <PageSelectorOption
                  key={`option-${index}`}
                  onClick={() => onSetPageSize(index)}
                  style={pageState.pageSize === option ? selectedPageOptionStyles : {}}>
                  {option}
                </PageSelectorOption>
              )
            })}
          </PageElement>
        </PagingElementsRow>
        {pageMeta && (
          <PagingElementsRow>
            <PageElement>
              <Text>table_totalRows</Text> <strong>{pageMeta.totalCount}</strong>
            </PageElement>
            {pageMeta.filteredCount !== pageMeta.totalCount && (
              <PageElement>
                <Text>table_filteredRows</Text> <strong>{pageMeta.filteredCount}</strong>
              </PageElement>
            )}
            {pageMeta.itemsOnPage !== pageMeta.totalCount && (
              <PageElement>
                <Text>table_rowsInView</Text> <strong>{pageMeta.itemsOnPage}</strong>
              </PageElement>
            )}
          </PagingElementsRow>
        )}
      </PagingControlView>
    )
  }
)

export default TablePagingControl
