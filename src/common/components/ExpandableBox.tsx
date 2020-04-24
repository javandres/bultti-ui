import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ArrowDown } from '../icon/ArrowDown'

const ExpandableBoxView = styled.div``

const HeaderRow = styled.div<{ expanded?: boolean }>`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  border-bottom: ${(p) => (p.expanded ? '1px solid var(--lighter-grey)' : '0')};

  > *:nth-child(even) {
    background-color: #fafafa;
  }
`

const ExpandToggle = styled.button<{ expanded?: boolean }>`
  background: transparent;
  cursor: pointer;
  border: 0;
  flex: 0;
  padding: 0.5rem 0.75rem;
  outline: none;
  display: flex;
  align-items: center;
  border-top-right-radius: 0.5rem;

  > * {
    transition: transform 0.1s ease-out;
    transform: rotate(${(p) => (p.expanded ? '180deg' : '0deg')});
  }
`

export type PropTypes = {
  children: React.ReactNode
  headerContent: React.ReactNode
  isExpanded?: boolean
  onToggleExpanded?: (expanded: boolean) => unknown
}

const ExpandableBox = observer(
  ({ children, headerContent, isExpanded, onToggleExpanded = () => {} }: PropTypes) => {
    const [expanded, setExpanded] = useState(true)

    let onChangeExpanded = useCallback(() => {
      setExpanded((currentVal) => !currentVal)
    }, [onToggleExpanded])

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
      <ExpandableBoxView>
        <HeaderRow expanded={expanded}>
          {headerContent}
          <ExpandToggle expanded={expanded} onClick={onChangeExpanded}>
            <ArrowDown width="1rem" height="1rem" fill="var(dark-grey)" />
          </ExpandToggle>
        </HeaderRow>
        {expanded && <>{children}</>}
      </ExpandableBoxView>
    )
  }
)

export default ExpandableBox
