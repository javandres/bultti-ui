import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import AppSidebar, { APP_TITLE_HEIGHT } from './AppSidebar'
import { observer } from 'mobx-react-lite'
import InfoMessages from './InfoMessages'
import { ArrowRight } from '../icon/ArrowRight'
import { text } from '../../util/translate'

const SIDEBAR_WIDTH = 270
const SIDEBAR_TOGGLE_BUTTON_CLICKABLE_AREA_WIDTH = 40

const AppFrameView = styled.div`
  display: grid;
  grid-template-columns: fit-content(25rem) auto;
  min-height: 100vh;

  @media screen and (min-height: 700px) {
    height: 100vh;
  }
`

const Sidebar = styled.div<{ isExpanded: boolean }>`
  height: 100%;
  background: var(--blue);
  color: white;
  overflow-y: ${(p) => (p.isExpanded ? 'auto' : 'hidden')};
  width: ${(p) => (p.isExpanded ? `${SIDEBAR_WIDTH}px` : '10px')};
  content-visibility: ${(p) => (p.isExpanded ? 'visible' : 'hidden')};
  transition: 0.5s;
`

const Main = styled.div`
  min-height: 100%;
  background: #f5f5f5;
  overflow-y: auto;
`

const SidebarToggleButton = styled.div<{ isSidebarExpanded: boolean }>`
  position: absolute;
  display: flex;
  top: ${APP_TITLE_HEIGHT / 2 - SIDEBAR_TOGGLE_BUTTON_CLICKABLE_AREA_WIDTH / 2}px;
  left: ${(p) =>
    p.isSidebarExpanded
      ? `${SIDEBAR_WIDTH - SIDEBAR_TOGGLE_BUTTON_CLICKABLE_AREA_WIDTH / 2}px`
      : `-${SIDEBAR_TOGGLE_BUTTON_CLICKABLE_AREA_WIDTH / 4}px`};
  width: ${SIDEBAR_TOGGLE_BUTTON_CLICKABLE_AREA_WIDTH}px;
  height: ${SIDEBAR_TOGGLE_BUTTON_CLICKABLE_AREA_WIDTH}px;
  transform: ${(p) => (p.isSidebarExpanded ? 'rotate(180deg)' : '')};
  font-weight: bold;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 99999;
  transition: 0.5s;
  border-radius: ${SIDEBAR_TOGGLE_BUTTON_CLICKABLE_AREA_WIDTH}px;

  svg {
    border-radius: ${SIDEBAR_TOGGLE_BUTTON_CLICKABLE_AREA_WIDTH}px;
    background-color: white;
    border: 2px solid var(--blue);
    fill: var(--blue);
    height: 1.75rem; // Adjust button width with height, width, padding
    width: 1.75rem; // Adjust button width with height, width, padding
    padding: 5px; // Adjust button width with height, width, padding
  }

  &:hover {
    svg {
      border: 2px solid var(--dark-blue);
      transition: 0.5s;
    }
  }
`

export type AppFrameProps = {
  children?: React.ReactNode
  isAuthenticated?: boolean
}

export type ScrollSubscriber = (scrollVal: number, frameHeight: number) => unknown
export const ScrollContext = React.createContext<(sub: ScrollSubscriber) => void>((sub) => {})

const AppFrame = observer(({ children, isAuthenticated = false }: AppFrameProps) => {
  let mainViewRef = useRef<HTMLDivElement | null>(null)
  const scrollSubscribers = useRef<ScrollSubscriber[]>([])
  let [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(true)

  const scrollHandler = useCallback(
    (e) => {
      let scrollVal = e.target?.scrollTop || 0
      let frameHeight = e.target?.offsetHeight || 0
      scrollSubscribers.current.forEach((sub) => sub(scrollVal, frameHeight))
    },
    [scrollSubscribers.current]
  )

  const subscribe = useCallback(
    (sub: ScrollSubscriber) => {
      if (!scrollSubscribers.current.includes(sub)) {
        scrollSubscribers.current.push(sub)
      }
    },
    [scrollSubscribers.current]
  )

  return (
    <>
      <AppFrameView>
        {isAuthenticated && (
          <>
            <Sidebar isExpanded={isSidebarExpanded}>
              <AppSidebar />
            </Sidebar>
            <SidebarToggleButton
              isSidebarExpanded={isSidebarExpanded}
              title={isSidebarExpanded ? text('closeSidebar') : text('openSidebar')}
              onClick={() => setSidebarExpanded(!isSidebarExpanded)}>
              <ArrowRight />
            </SidebarToggleButton>
            <ScrollContext.Provider value={subscribe}>
              <Main onScroll={scrollHandler} ref={mainViewRef}>
                {children}
              </Main>
            </ScrollContext.Provider>
          </>
        )}
      </AppFrameView>
      <InfoMessages />
    </>
  )
})

export default AppFrame
