import React from 'react'
import styled from 'styled-components'
import AppSidebar from './AppSidebar'

const AppFrameView = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`

const Sidebar = styled.div`
  height: 100%;
  flex: 1 0 20rem;
  background: var(--blue);
  color: white;
`

const SidebarContent = styled.div`
 
`

const Main = styled.div`
  flex: 3 0 calc(100% - 20rem);
  height: 100%;
  overflow-y: scroll;
  padding: 1rem;
`

const MainContent = styled.div`
   height: 200vh;
`

export type AppFrameProps = {
  children?: React.ReactNode
}

const AppFrame = ({ children }: AppFrameProps) => {
  return (
    <AppFrameView>
      <Sidebar>
        <SidebarContent>
          <AppSidebar />
        </SidebarContent>
      </Sidebar>
      <Main>
        <MainContent>
          {children}
        </MainContent>
      </Main>
    </AppFrameView>
  )
}

export default AppFrame
