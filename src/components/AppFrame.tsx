import React from 'react'
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
  height: 100%;
  overflow-y: scroll;
`

export type AppFrameProps = {
  children?: React.ReactNode
}

const AppFrame = observer(({ children }: AppFrameProps) => {
  return (
    <AppFrameView>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <Main>{children}</Main>
    </AppFrameView>
  )
})

export default AppFrame
