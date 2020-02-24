import React from 'react'
import { svgSize } from '../../utils/svg'

type IconProps = {
  fill?: string
  height?: string | number
  width?: string | number
} & {
  [propName: string]: string | number
}

export function Login({ fill, height, width, ...rest }: IconProps) {
  return (
    <svg
      {...rest}
      {...svgSize(height, width)}
      viewBox="0 0 448 512"
      preserveAspectRatio="xMidYMid meet">
      <g fill={fill} id="Mobile" fillRule="evenodd">
        <path
          d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"
          id="Fill-1"
        />
      </g>
    </svg>
  )
}
