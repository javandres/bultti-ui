import React from 'react'
import { svgSize } from '../../util/svg'

type IconProps = {
  fill?: string
  height?: string | number
  width?: string | number
} & {
  [propName: string]: string | number
}

export function Trash({ fill, height, width, ...rest }: IconProps) {
  return (
    <svg
      {...rest}
      {...svgSize(height, width)}
      viewBox="0 0 20 22"
      version="1.1"
      preserveAspectRatio="xMidYMid meet">
      <g stroke="none" strokeWidth="1" fillRule="evenodd">
        <rect fill={fill} x="0" y="3" width="20" height="2" rx="1" />
        <path
          d="M2,5 L18,5 L18,19 C18,20.6568542 16.6568542,22 15,22 L5,22 C3.34314575,22 2,20.6568542 2,19 L2,5 Z"
          fill={fill}
        />
        <rect
          className="fill-inverse"
          fill="#FFFFFF"
          x="7"
          y="8"
          width="2"
          height="10"
          rx="1"
        />
        <rect
          className="fill-inverse"
          fill="#FFFFFF"
          x="11"
          y="8"
          width="2"
          height="10"
          rx="1"
        />
        <path
          d="M6,0 L14,0 L14,1 C14,1.55228475 13.5522847,2 13,2 L7,2 C6.44771525,2 6,1.55228475 6,1 L6,0 Z"
          fill={fill}
        />
        <rect fill={fill} x="6" y="1" width="2" height="3" />
        <rect fill={fill} x="12" y="1" width="2" height="3" />
      </g>
    </svg>
  )
}
