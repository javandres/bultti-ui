import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { TabsWrapper } from './Tabs'
import { Button, ButtonSize, ButtonStyle, StyledButton } from './Button'
import { Link } from '@reach/router'
import { ArrowLeftLong } from '../icon/ArrowLeftLong'
import { history, pathWithQuery } from '../../util/urlValue'
import { promptUnsavedChangesOnClickEvent } from '../../util/promptUnsavedChanges'
import { useStateValue } from '../../state/useAppState'

const PageTitleView = styled.h2`
  border-bottom: 1px solid var(--lighter-grey);
  padding: 1rem;
  margin-bottom: 1.5rem;
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

const BackLink = styled(Link)`
  padding-right: 1rem;
  width: 2rem;
  transition: transform 0.1s ease-out;

  &:hover {
    transform: scale(1.1);
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
  showBackLink?: boolean
  onRefresh?: () => unknown
  loading?: boolean
  headerButtons?: React.ReactNode
}

export const PageTitle = observer(
  ({
    children,
    showBackLink = true,
    onRefresh,
    loading = false,
    headerButtons,
  }: PropTypes) => {
    let canGoBack = useMemo(() => !!showBackLink && history.location.pathname !== '/', [
      showBackLink,
      history,
    ])
    let unsavedFormIdsState = useStateValue('unsavedFormIds')
    return (
      <PageTitleView>
        {canGoBack && (
          <BackLink
            onClick={promptUnsavedChangesOnClickEvent(unsavedFormIdsState)}
            to={pathWithQuery('../')}>
            <ArrowLeftLong fill="var(--dark-grey)" width="1rem" height="1rem" />
          </BackLink>
        )}
        {children}
        <HeaderButtons>
          {onRefresh && (
            <Button
              loading={loading}
              size={ButtonSize.MEDIUM}
              buttonStyle={ButtonStyle.SECONDARY}
              onClick={() => onRefresh()}>
              Päivitä
            </Button>
          )}
          {headerButtons}
        </HeaderButtons>
      </PageTitleView>
    )
  }
)
