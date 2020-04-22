import React, { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import AppSidebar from './AppSidebar'
import { observer } from 'mobx-react-lite'

const AppFrameView = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`

const Sidebar = styled.div`
  height: 100%;
  flex: 1 0 27rem;
  background: var(--blue);
  color: white;
`

const Main = styled.div`
  flex: 3 0 calc(100% - 27rem);
  min-height: 100%;
  overflow-y: scroll;
  background: #f5f5f5;

  > * {
    min-height: 100%;
  }
`

export type AppFrameProps = {
  children?: React.ReactNode
}

export type ScrollSubscriber = (scrollVal: number) => void

export const ScrollContext = React.createContext<(sub: ScrollSubscriber) => void>((sub) => {})

const AppFrame = observer(({ children }: AppFrameProps) => {
  let mainViewRef = useRef<any>(null)
  const scrollSubscribers = useRef<ScrollSubscriber[]>([])

  const scrollHandler = useCallback(
    (e) => {
      let scrollVal = e.target?.scrollTop || 0
      scrollSubscribers.current.forEach((sub) => sub(scrollVal))
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

  useEffect(() => {
    if (mainViewRef.current) {
      mainViewRef.current?.addEventListener('scroll', scrollHandler, { passive: true })
    }

    return () => {
      if (mainViewRef.current) {
        mainViewRef.current?.removeEventListener('scroll', scrollHandler)
      }
    }
  }, [mainViewRef.current])

  return (
    <AppFrameView>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <ScrollContext.Provider value={subscribe}>
        <Main ref={mainViewRef}>{children}</Main>
      </ScrollContext.Provider>
    </AppFrameView>
  )
})

export default AppFrame
