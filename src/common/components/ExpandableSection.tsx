import React, { CSSProperties, useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { observer } from 'mobx-react-lite'
import { forOwn } from 'lodash'
import { ArrowDown } from '../icon/ArrowDown'
import { SectionHeading } from './Typography'

const ExpandableBoxView = styled.div<{ error: boolean }>`
  border: ${(p) => (p.error ? `1px solid var(--red)` : '1px solid var(--lighter-grey)')};
  margin-top: 1rem;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
`

export const HeaderRow = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
`

export const HeaderSection = styled.div<{ error?: boolean }>`
  font-size: 0.875rem;
  padding: 0.75rem;
  border-right: 1px solid var(--lighter-grey);
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;

  &:nth-child(even) {
    background-color: #fafafa;
  }

  &:last-child {
    border-right: 0;
  }

  ${(p) =>
    p.error
      ? css`
          border-left: 1px solid var(--red) !important;
          border-right: 1px solid var(--red) !important;
          background: rgba(255, 245, 245, 1) !important;
        `
      : ''}
`

export const HeaderMainHeading = styled(SectionHeading)`
  margin: 0;
  padding: 0.7rem 0.75rem;
  flex: 1 1 50%;
  border-right: 1px solid var(--lighter-grey);
  display: flex;
  align-items: center;

  &:last-child {
    border-right: 0;
  }
`

export const HeaderBoldHeading = styled.h4`
  margin: 0;
  padding: 0.5rem 0.75rem;
  flex: 1 1 50%;
  border-right: 1px solid var(--lighter-grey);
  display: flex;
  align-items: center;

  &:last-child {
    border-right: 0;
  }
`

export const HeaderHeading = styled.h5`
  font-size: 0.875rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  user-select: none;

  &:first-child {
    margin-top: 0;
  }
`

export const HeaderContentWrapper = styled.div<{ expanded?: boolean }>`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  flex: 1 1 auto;
  border-right: 1px solid var(--lighter-grey);
  border-bottom: ${(p) => (p.expanded ? '1px solid var(--lighter-grey)' : '0')};
`

export const ContentWrapper = styled.div<{ expanded: boolean }>`
  padding: ${(p) => (p.expanded ? '1rem' : '0')};
  height: ${(p) => (p.expanded ? 'auto' : 0)};
  overflow: ${(p) => (p.expanded ? 'hidden' : 'auto')};
`

export const ExpandToggle = styled.button<{ expanded?: boolean }>`
  background: transparent;
  cursor: pointer;
  border: 0;
  flex: 0;
  padding: 0.5rem 0.75rem;
  outline: none;
  display: flex;
  align-items: center;
  border-top-right-radius: 0.5rem;
  margin-left: auto;

  > * {
    transition: transform 0.1s ease-out;
    transform: rotate(${(p) => (p.expanded ? '180deg' : '0deg')});
  }
`

export type PropTypes = {
  children: React.ReactNode | ((expanded?: boolean) => React.ReactNode)
  headerContent?: React.ReactNode | ((expanded?: boolean) => React.ReactNode)
  isExpanded?: boolean
  onToggleExpanded?: (expanded: boolean) => unknown
  className?: string
  style?: CSSProperties
  error?: boolean
  // For large content it is advisable to unmount when the expander is closed.
  unmountOnClose?: boolean
}

const ExpandableSection = observer(
  ({
    children,
    headerContent,
    isExpanded = false,
    onToggleExpanded = () => {},
    className,
    style,
    error = false,
    unmountOnClose = false,
  }: PropTypes) => {
    const [expanded, setExpanded] = useState(isExpanded)

    let onClickHeaderRow = useCallback(
      (e: React.MouseEvent) => {
        let wasExpandableSectionClicked = false
        forOwn((e.target as Element).classList, (value) => {
          if ((value as string).includes('ExpandableSection'))
            wasExpandableSectionClicked = true
        })

        if (wasExpandableSectionClicked) {
          setExpanded((currentVal) => !currentVal)
        }
      },
      [onToggleExpanded]
    )

    const onClickExpandToggle = useCallback(
      (e: React.MouseEvent) => {
        setExpanded((currentVal) => !currentVal)
        e.stopPropagation()
      },
      [onToggleExpanded]
    )

    useEffect(() => {
      onToggleExpanded(expanded)
    }, [expanded])

    // Sync internal state when expanded prop changes.
    useEffect(() => {
      if (typeof isExpanded === 'boolean') {
        setExpanded(isExpanded)
      }
    }, [isExpanded])

    return (
      <ExpandableBoxView error={error} style={style} className={className}>
        <HeaderRow onClick={onClickHeaderRow}>
          {headerContent && (
            <HeaderContentWrapper expanded={expanded}>
              {typeof headerContent === 'function' ? headerContent(expanded) : headerContent}
            </HeaderContentWrapper>
          )}
          <ExpandToggle expanded={expanded} onClick={onClickExpandToggle}>
            <ArrowDown width="1rem" height="1rem" fill="var(dark-grey)" />
          </ExpandToggle>
        </HeaderRow>
        {(expanded || !unmountOnClose) && (
          <ContentWrapper expanded={expanded}>
            {typeof children === 'function' ? children(expanded) : children}
          </ContentWrapper>
        )}
      </ExpandableBoxView>
    )
  }
)

export default ExpandableSection
