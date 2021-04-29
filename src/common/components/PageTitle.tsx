import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { TabsWrapper } from './Tabs'
import { Button, ButtonSize, ButtonStyle, StyledButton } from './buttons/Button'
import { Text } from '../../util/translate'

const PageTitleView = styled.h2`
  border-bottom: 1px solid var(--lighter-grey);
  padding: 1rem 1rem 1rem 2rem;
  margin-bottom: 0;
  margin-left: 0;
  margin-top: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  & + ${TabsWrapper} {
    border-top: 1px solid white;
    margin-top: calc(-1.5rem - 1px);
  }

  & > ${StyledButton} {
    margin-left: auto;
  }
`

const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;

  > * {
    margin-left: 1rem;
  }
`

export type PropTypes = {
  children?: React.ReactNode
  onRefresh?: () => unknown
  loading?: boolean
  headerButtons?: React.ReactNode
}

export const PageTitle = observer(
  ({ children, onRefresh, loading = false, headerButtons }: PropTypes) => {
    return (
      <PageTitleView>
        {children}
        <HeaderButtons>
          {onRefresh && (
            <Button
              loading={loading}
              size={ButtonSize.MEDIUM}
              buttonStyle={ButtonStyle.SECONDARY}
              onClick={() => onRefresh()}>
              <Text>update</Text>
            </Button>
          )}
          {headerButtons}
        </HeaderButtons>
      </PageTitleView>
    )
  }
)
