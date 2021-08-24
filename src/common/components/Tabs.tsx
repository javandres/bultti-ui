import React, { Children, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import styled, { keyframes } from 'styled-components/macro'
import compact from 'lodash/compact'
import flow from 'lodash/flow'
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import LinkWithQuery from './LinkWithQuery'
import { last } from 'lodash'
import { useNavigate } from '../../util/urlValue'

export const TabsWrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  position: relative;
  z-index: 1;
  max-width: 100%;
  height: 100%;
`

const TabButtonsWrapper = styled.div<{ path?: unknown }>`
  background-color: transparent;
  border-bottom: 1px solid var(--blue);
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
`

const TabButton = styled(LinkWithQuery)<{ selected?: boolean }>`
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

const TabContentWrapper = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
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
  default?: boolean
}

type TabChildComponent = React.ReactElement<{
  name: string
  path: string
  label: string
  loading?: boolean
  testId?: string
}>

type PropTypes = {
  children: (TabChildComponent | false)[]
  className?: string
  rootPath?: string
  testId?: string
}

let getPathName = (base, path) => (path === '/' ? base : `${base}/${path}`.replace('//', '/'))

const Tabs: React.FC<PropTypes> = decorate(({ children, className, testId }) => {
  let { path, url } = useRouteMatch()

  // The children usually contain an empty string as the first element.
  // Remove all such falsy values from the array.
  const validChildren = useMemo(
    () => compact(Children.toArray(children)) as TabChildComponent[],
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
  let navigate = useNavigate()

  // Revert to the root tab if the current tab disappears.
  useEffect(() => {
    let currentTab = last(location.pathname.split('/'))

    if (
      currentTab &&
      !tabs.some((tab) => tab.path === currentTab) &&
      location.pathname !== url
    ) {
      navigate.replace(url)
    }
  }, [tabs, navigate, location, url])

  return (
    <TabsWrapper className={className}>
      <TabButtonsWrapper>
        {tabs.map((tabOption) => (
          <Route
            key={`tab_link_${tabOption.name}`}
            exact={tabOption.path === '/'}
            path={getPathName(path, tabOption.path)}>
            {({ match }) => (
              <TabButton
                to={getPathName(url, tabOption.path)}
                data-cy={`${testId}_tab_${tabOption.testId}`}
                selected={!!match}>
                {tabOption.loading && <LoadingIndicator data-cy="loading" />}
                <TabLabel>{tabOption.label}</TabLabel>
              </TabButton>
            )}
          </Route>
        ))}
      </TabButtonsWrapper>
      <TabContentWrapper>
        <Switch>
          {validChildren.map((tabChild) => (
            <Route
              exact={tabChild.props.path === '/'}
              key={tabChild.props.name}
              path={getPathName(path, tabChild.props.path)}
              render={() => tabChild}
            />
          ))}
        </Switch>
      </TabContentWrapper>
    </TabsWrapper>
  )
})

export default Tabs
