import React, { Children, ReactNode, useEffect, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled, { keyframes } from 'styled-components'
import compact from 'lodash/compact'
import flow from 'lodash/flow'

export const TabsWrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  position: relative;
  z-index: 1;
  max-width: 100%;
`

const TabButtonsWrapper = styled.div`
  background-color: white;
  border-bottom: 1px solid var(--blue);
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
`

const TabButton = styled.button<{ fontSizeMultiplier?: number; selected?: boolean }>`
  font-family: inherit;
  font-size: ${({ fontSizeMultiplier = 1 }) => `calc(0.45rem * ${fontSizeMultiplier})`};
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  text-transform: uppercase;
  background-color: ${({ selected }) => (selected ? 'var(--blue)' : 'var(--lightest-grey)')};
  color: ${({ selected }) => (selected ? 'white' : 'var(--dark-grey)')};
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
  margin: 0 0.25rem;
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
  padding-top: 1.5rem;
  height: 100%;
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
    var(--lighter-green) 50%,
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
}

type TabConfig = {
  name: string
  label: string
  content: ReactNode
  loading: boolean
  testId: string
}

type PropTypes = {
  children: ReactNode | ReactNode[]
  testIdPrefix?: string
  className?: string
}

const Tabs: React.FC<PropTypes> = decorate(
  ({ testIdPrefix = 'page-tabs', children, className }) => {
    let [selectedTab, selectTab] = useState('')
    // The children usually contain an empty string as the first element.
    // Compact() removes all such falsy values from the array.
    const validChildren: ReactNode[] = useMemo(
      () => compact<ReactNode>(Children.toArray(children)),
      [children]
    )

    // An array of child tab data with labels etc is extracted from props.children.
    let tabs: TabConfig[] = useMemo(() => {
      const childrenTabs = validChildren.map((tabContent) => {
        if (!tabContent || !React.isValidElement(tabContent)) {
          return null
        }

        const { name, label, loading, testId = name } = tabContent.props
        return { name, label, content: tabContent, loading, testId }
      })

      return compact(childrenTabs)
    }, [validChildren])

    // Various auto-select routines based on what tabs are available
    useEffect(() => {
      if (tabs.length !== 0) {
        const tabNames = tabs.map(({ name }) => name)
        let nextTab = selectedTab

        if (!selectedTab || !tabNames.includes(selectedTab)) {
          nextTab = tabNames[0]
        }

        selectTab(nextTab)
      }
    }, [tabs, selectedTab])

    // The tab content to render
    const selectedTabContent: ReactNode | null = useMemo(() => {
      const selectedTabItem = tabs.find((tab) => tab.name === selectedTab)
      // Set the current tab content to the selected tab
      if (selectedTabItem) {
        return selectedTabItem.content
      }

      return null
    }, [tabs, selectedTab])

    // Fit the tab label into the ever-shrinking tab element
    const tabLabelFontSizeMultiplier =
      tabs.length <= 2 ? 1.75 : tabs.length < 4 ? 1.5 : tabs.length < 5 ? 1.2 : 1

    return (
      <TabsWrapper className={className}>
        <TabButtonsWrapper>
          {tabs.map((tabOption) => (
            <TabButton
              key={tabOption.name}
              data-testid={`${testIdPrefix}-tab ${testIdPrefix}-tab-${tabOption.testId}`}
              fontSizeMultiplier={tabLabelFontSizeMultiplier}
              selected={selectedTab === tabOption.name}
              onClick={() => selectTab(tabOption.name)}>
              {tabOption.loading && <LoadingIndicator data-testid="loading" />}
              <TabLabel>{tabOption.label}</TabLabel>
            </TabButton>
          ))}
        </TabButtonsWrapper>
        {selectedTabContent && <TabContentWrapper>{selectedTabContent}</TabContentWrapper>}
      </TabsWrapper>
    )
  }
)

export default Tabs
