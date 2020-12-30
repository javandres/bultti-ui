import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import Dropdown from '../common/input/Dropdown'

const ReportPagingView = styled.div`
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
  reportData: any
  onNextPage: () => unknown
  onPrevPage: () => unknown
  onSetPage: (setToPage: number) => unknown
}

const ReportPaging = observer(
  ({ reportData, onNextPage, onPrevPage, onSetPage }: PropTypes) => {
    let pageOptions = useMemo(() => {
      let opts: number[] = []
      let pageIdx = 1

      while (opts.length < (reportData.pages || 1)) {
        opts.push(pageIdx++)
      }

      return opts
    }, [reportData.pages])

    return (
      <ReportPagingView>
        <PageValue>
          Rivejä: <strong>{reportData.totalCount}</strong>
        </PageValue>
        {(reportData.filters || []).length !== 0 && (
          <PageValue>
            Filtteröityjä rivejä: <strong>{reportData.filteredCount}</strong>
          </PageValue>
        )}
        <PageValue>
          Rivejä per sivu: <strong>{reportData.page?.pageSize}</strong>
        </PageValue>
        {reportData.page?.pageSize !== reportData.reportData?.length && (
          <PageValue>
            Rivejä näkymässä: <strong>{reportData.reportData?.length}</strong>
          </PageValue>
        )}
        <PagingWrapper>
          <Button
            disabled={(reportData.page?.page || 1) <= 1}
            size={ButtonSize.SMALL}
            buttonStyle={ButtonStyle.SECONDARY}
            onClick={onPrevPage}>
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
              selectedItem={reportData.page?.page || 1}
              items={pageOptions}
              onSelect={onSetPage}
              itemToString={(idx) => idx}
              itemToLabel={(idx) => idx}
            />
            <strong>/ {reportData.pages}</strong>
          </PageValue>
          <Button
            disabled={!((reportData.page?.page || 1) < (reportData.pages || 1))}
            size={ButtonSize.SMALL}
            buttonStyle={ButtonStyle.SECONDARY}
            onClick={onNextPage}>
            Seuraava
          </Button>
        </PagingWrapper>
      </ReportPagingView>
    )
  }
)

export default ReportPaging
