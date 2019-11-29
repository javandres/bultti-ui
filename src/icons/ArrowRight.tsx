import React from 'react'
import { svgSize } from '../utils/svg'

type IconProps = {
  fill?: string
  height?: string | number
  width?: string | number
} & {
  [propName: string]: string | number
}

export function ArrowRight({ fill, height, width, ...rest }: IconProps) {
  return (
    <svg
      {...rest}
      {...svgSize(height, width)}
      viewBox="0 0 20 36"
      version="1.1"
      preserveAspectRatio="xMidYMid meet">
      <path
        fill={fill}
        d="M16.546625,19.906375 L19.453625,17.000375 L19.453625,16.999375 L4.055625,1.601375 C3.252625,0.798375 1.951625,0.798375 1.148625,1.601375 C0.345625,2.404375 0.345625,3.705375 1.148625,4.508375 L13.639625,16.999375 L1.148625,29.490375 C0.345625,30.293375 0.345625,31.594375 1.148625,32.397375 C1.951625,33.200375 3.252625,33.200375 4.055625,32.397375 L16.546625,19.906375 L16.546625,19.906375 Z"
        id="Collapse-Right"
      />
    </svg>
  )
}
