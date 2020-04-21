import React, { useEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { HSLLogoNoText } from '../icon/HSLLogoNoText'
import { Colors } from '../../util/HSLColors'
import { observer } from 'mobx-react-lite'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  
  to {
    transform: rotate(360deg);
  }
`

const LoadingIndicator = styled.div<{ inline: boolean }>`
  background: white;
  border-radius: 50%;
  padding: 0.75rem;
  box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.2);
  color: white;
  width: 3.7rem;
  height: 3.7rem;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ inline }) =>
    inline
      ? css`
          width: 0.75rem;
          height: 0.75rem;
          padding: 0;
          background: transparent;
          box-shadow: none;
          position: relative;
          display: inline-block;
        `
      : ''};

  svg {
    display: block;
    animation: ${spin} 1.5s ease-in-out infinite;
  }
`

const LoadingSafeDivComponent = ({ loading, ...props }) => <div {...props} />

const LoadingContainer = styled(LoadingSafeDivComponent)<{ loading?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.2s ease-out, transform 0.3s ease-out;
  transform: translateY(-5rem);
  z-index: 10;

  ${({ loading = false }) =>
    loading
      ? css`
          opacity: 1;
          pointer-events: all;
          transform: translateY(0);
        `
      : ''};
`

const PageLoadingContainer = styled(LoadingSafeDivComponent)`
  position: relative;
  padding: 0 1.5rem;
  margin: 1rem 0;
`

type LoadingProps = {
  className?: string
  inline?: boolean
  size?: number
  color?: string
  _testWait?: boolean
}

const Loading = observer(
  ({
    className,
    inline = false,
    color = Colors.secondary.hslGreenLight,
    size,
    _testWait = true,
  }: LoadingProps) => {
    const defaultSize = inline ? 24 : 35
    const useSize = size || defaultSize

    return (
      <LoadingIndicator
        data-testid={_testWait ? 'loading' : 'loading-bg'}
        inline={inline}
        style={inline ? { width: useSize, height: useSize } : {}}
        className={className}>
        <HSLLogoNoText
          fill={color || Colors.secondary.hslGreenLight}
          width={useSize}
          height={useSize}
        />
      </LoadingIndicator>
    )
  }
)

export default Loading

type LoadingDisplayProps = {
  loading?: boolean
  className?: string
  inline?: boolean
  size?: number
  color?: string
}

export const LoadingDisplay = observer(
  ({ loading = true, className, inline = false, size, color }: LoadingDisplayProps) => {
    const [isRendered, setIsRendered] = useState(loading)
    const timerRef = useRef(0)

    useEffect(() => {
      if (loading) {
        setIsRendered(true)
      } else {
        timerRef.current = window.setTimeout(() => {
          setIsRendered(false)
        }, 300)
      }

      return () => {
        window.clearTimeout(timerRef.current)
      }
    }, [loading])

    if (!isRendered) {
      return null
    }

    return (
      <LoadingContainer data-testid="loading-container" className={className} loading={loading}>
        <Loading inline={inline} size={size} color={color} />
      </LoadingContainer>
    )
  }
)

const PageLoadingIndicator = styled(Loading)`
  background: transparent;
  box-shadow: none;
  padding: 0;
  width: auto;
  height: auto;
`

export const PageLoading: React.FC<LoadingDisplayProps> = observer(
  ({ loading = true, className, inline = false, size }) => {
    return (
      <PageLoadingContainer data-testid="page-loading" className={className} loading={loading}>
        <PageLoadingIndicator size={16 * 5} />
      </PageLoadingContainer>
    )
  }
)
