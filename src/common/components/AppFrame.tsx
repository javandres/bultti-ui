import React, { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import AppSidebar from './AppSidebar'
import { observer } from 'mobx-react-lite'
import ErrorMessages from './ErrorMessages'

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
`

export type AppFrameProps = {
  children?: React.ReactNode
  isAuthenticated?: boolean
}

export type ScrollSubscriber = (scrollVal: number, frameHeight: number) => void

export const ScrollContext = React.createContext<(sub: ScrollSubscriber) => void>((sub) => {})

const AppFrame = observer(({ children, isAuthenticated = false }: AppFrameProps) => {
  let mainViewRef = useRef<any>(null)
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
      {isAuthenticated && (
        <>
          <Sidebar>
            <AppSidebar />
          </Sidebar>
          <ScrollContext.Provider value={subscribe}>
            <Main ref={mainViewRef}>{children}</Main>
          </ScrollContext.Provider>
        </>
      )}
      <ErrorMessages />
    </AppFrameView>
  )
})

export default AppFrame
