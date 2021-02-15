import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Button, ButtonSize, ButtonStyle } from '../components/Button'
import Dropdown from '../input/Dropdown'
import { PageState } from './tableUtils'
import { PageConfig } from '../../schema-types'

const PagingControlView = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  margin: 0 -1rem;
`

const PageValue = styled.div`
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
  margin-right: 0.5rem;
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

export type PropTypes = {
  pageState: PageState
  onSetPage: Dispatch<SetStateAction<PageConfig>>
}

const TablePagingControl = observer(({ pageState, onSetPage }: PropTypes) => {
  let pageOptions = useMemo(() => {
    let opts: number[] = []
    let pageIdx = 1

    while (opts.length < (pageState.pages || 1)) {
      opts.push(pageIdx++)
    }

    return opts
  }, [pageState.pages])

  let onPageNav = useCallback(
    (offset) => {
      return () => {
        onSelectPage((currentPage) => {
          let nextPageIdx = Math.min(
            Math.max(currentPage.page + offset, 1),
            pageState.pages || 1
          )

          return {
            ...currentPage,
            page: nextPageIdx,
          }
        })
      }
    },
    [pageState.pages]
  )

  let onSelectPage = useCallback(
    (setPageTo) => {
      onSetPage((currentPage) => {
        let nextPageIdx = Math.min(Math.max(setPageTo, 1), pageState.pages || 1)

        return {
          ...currentPage,
          page: nextPageIdx,
        }
      })
    },
    [pageState.pages]
  )

  return (
    <PagingControlView>
      <PageValue>
        Rivejä: <strong>{pageState.totalCount}</strong>
      </PageValue>
      {pageState.filteredCount !== pageState.totalCount && (
        <PageValue>
          Filtteröityjä rivejä: <strong>{pageState.filteredCount}</strong>
        </PageValue>
      )}
      <PageValue>
        Rivejä per sivu: <strong>{pageState.pageSize}</strong>
      </PageValue>
      {pageState.pageSize !== pageState.totalCount && (
        <PageValue>
          Rivejä näkymässä: <strong>{pageState.itemsOnPage}</strong>
        </PageValue>
      )}
      <PagingWrapper>
        <Button
          disabled={(pageState.currentPage || 1) <= 1}
          size={ButtonSize.SMALL}
          buttonStyle={ButtonStyle.SECONDARY}
          onClick={() => onPageNav(-1)}>
          Edellinen
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
            onSelect={onSelectPage}
            itemToString={(idx) => idx}
            itemToLabel={(idx) => idx}
          />
          <strong>/ {pageState.pages}</strong>
        </PageValue>
        <Button
          disabled={!((pageState.currentPage || 1) < (pageState.pages || 1))}
          size={ButtonSize.SMALL}
          buttonStyle={ButtonStyle.SECONDARY}
          onClick={() => onPageNav(1)}>
          Seuraava
        </Button>
      </PagingWrapper>
    </PagingControlView>
  )
})

export default TablePagingControl
