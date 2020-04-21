import React, { useEffect, useLayoutEffect, useRef } from 'react'
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

const scrollSubscribers: ScrollSubscriber[] = []

const scrollHandler = (e) => {
  let scrollVal = e.target?.scrollTop || 0
  scrollSubscribers.forEach((sub) => sub(scrollVal))
}

const subscribe = (sub: ScrollSubscriber) => {
  if (!scrollSubscribers.includes(sub)) {
    scrollSubscribers.push(sub)
  }
}

export const ScrollContext = React.createContext(subscribe)

const AppFrame = observer(({ children }: AppFrameProps) => {
  let mainRef = useRef<any>(null)

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current?.addEventListener('scroll', scrollHandler, { passive: true })
    }

    return () => {
      if (mainRef.current) {
        mainRef.current?.removeEventListener('scroll', scrollHandler)
      }
    }
  }, [mainRef.current])

  return (
    <AppFrameView>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <ScrollContext.Provider value={subscribe}>
        <Main ref={mainRef}>{children}</Main>
      </ScrollContext.Provider>
    </AppFrameView>
  )
})

export default AppFrame
