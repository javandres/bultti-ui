import React, { Children, ReactNode, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import styled, { keyframes } from 'styled-components'
import compact from 'lodash/compact'
import flow from 'lodash/flow'
import { Link, Match, RouteComponentProps, Router, useLocation } from '@reach/router'
import { pathWithQuery } from '../../util/urlValue'

export const TabsWrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  position: relative;
  z-index: 1;
  max-width: 100%;
`

const TabButtonsWrapper = styled.div<{ path?: any }>`
  background-color: white;
  border-bottom: 1px solid var(--blue);
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
`

const TabButton = styled(Link)<{ selected?: boolean }>`
  font-family: inherit;
  font-size: 1rem;
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  text-transform: uppercase;
  text-decoration: none;
  background-color: ${({ selected }) => (selected ? 'var(--blue)' : 'var(--lightest-grey)')};
  color: ${({ selected }) => (selected ? 'white' : 'var(--grey)')};
  border: 1px solid var(--lighter-grey);
  border-bottom: 0;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  flex: 1 1 auto;
  width: auto;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: 0;
  padding: 0.7rem 3px;
  margin: 0 0.7rem;
  position: relative;
  overflow: hidden;

  &:last-child {
    border-right: 0;
  }

  &:only-child {
    padding-bottom: 0.5rem;
  }
`

const TabContentWrapper = styled.div<RouteComponentProps>`
  padding-top: 1.5rem;
  height: 100%;
  overflow-x: hidden;
`

const progress = keyframes`
  from {
    transform: translateX(-100%);
  }
  
  to {
    transform: translateX(100%);
  }
`

const LoadingIndicator = styled.div`
  animation: ${progress} 0.75s linear infinite;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 20%,
    var(--light-blue) 50%,
    rgba(0, 0, 0, 0) 80%
  );
  z-index: 0;
`

const TabLabel = styled.span`
  position: relative;
  white-space: nowrap;
`

const decorate = flow(observer)

export type TabChildProps = {
  name?: string
  label?: string
  path?: string
  loading?: boolean
  testId?: string
}

type PropTypes = {
  children: ReactNode | ReactNode[]
  testIdPrefix?: string
  className?: string
  rootPath?: string
}

let getPathName = (path) => (path === '/' ? './' : path)

const Tabs: React.FC<PropTypes> = decorate(
  ({ testIdPrefix = 'page-tabs', children, className }) => {
    // The children usually contain an empty string as the first element.
    // Compact() removes all such falsy values from the array.
    const validChildren: ReactNode[] = useMemo(
      () => compact<ReactNode>(Children.toArray(children)),
      [children]
    )

    // An array of child tab data with labels etc is extracted from props.children.
    let tabs: TabChildProps[] = useMemo(() => {
      const childrenTabs = validChildren.map((tabContent) => {
        if (!tabContent || !React.isValidElement(tabContent)) {
          return null
        }

        const { name, label, path, loading, testId = name } = tabContent.props
        return { name, label, path, loading, testId }
      })

      return compact(childrenTabs)
    }, [validChildren])

    let location = useLocation()

    return (
      <TabsWrapper className={className}>
        <TabButtonsWrapper>
          {tabs.map((tabOption) => (
            <Match key={`tab_link_${tabOption.name}`} path={getPathName(tabOption.path)}>
              {({ match }) => (
                <TabButton
                  to={pathWithQuery(getPathName(tabOption.path), location)}
                  data-testid={`${testIdPrefix}-tab ${testIdPrefix}-tab-${tabOption.testId}`}
                  selected={!!match}>
                  {tabOption.loading && <LoadingIndicator data-testid="loading" />}
                  <TabLabel>{tabOption.label}</TabLabel>
                </TabButton>
              )}
            </Match>
          ))}
        </TabButtonsWrapper>
        <TabContentWrapper>
          <Router primary={false}>{children}</Router>
        </TabContentWrapper>
      </TabsWrapper>
    )
  }
)

export default Tabs
