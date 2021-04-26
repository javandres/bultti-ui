import React, { useCallback, useRef } from 'react'
import styled from 'styled-components/macro'
import AppSidebar from './AppSidebar'
import { observer } from 'mobx-react-lite'
import InfoMessages from './InfoMessages'

const AppFrameView = styled.div`
  display: grid;
  grid-template-columns: fit-content(25rem) auto;
  min-height: 100vh;

  @media screen and (min-height: 700px) {
    height: 100vh;
  }
`

const Sidebar = styled.div`
  height: 100%;
  background: var(--blue);
  color: white;
  overflow-y: auto;
`

const Main = styled.div`
  min-height: 100%;
  background: #f5f5f5;
  overflow-y: auto;
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
    <AppFrameView>
      <InfoMessages messageType="info" />
      {isAuthenticated && (
        <>
          <Sidebar>
            <AppSidebar />
          </Sidebar>
          <ScrollContext.Provider value={subscribe}>
            <Main onScroll={scrollHandler} ref={mainViewRef}>
              {children}
            </Main>
          </ScrollContext.Provider>
        </>
      )}
      <InfoMessages messageType="error" />
    </AppFrameView>
  )
})

export default AppFrame
