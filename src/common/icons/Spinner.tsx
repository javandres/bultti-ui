import React from 'react'
import { svgSize } from '../../utils/svg'
import { Colors } from '../../utils/HSLColors'

type IconProps = {
  fill?: string
  height?: string | number
  width?: string | number
} & {
  [propName: string]: string | number
}

export const Spinner = ({
  width,
  height,
  fill = Colors.secondary.hslGreenLight,
  ...rest
}: IconProps) => (
  <svg {...svgSize(height, width)} viewBox="0 0 80 80" {...rest} version="1.1">
    <path
      fill={fill}
      d="M40,80C17.944,80,0,62.056,0,40C0,17.944,17.944,0,40,0c22.056,0,40,17.944,40,40c0,2.209-1.791,4-4,4s-4-1.791-4-4C72,22.355,57.645,8,40,8C22.355,8,8,22.355,8,40c0,17.645,14.355,32,32,32c2.209,0,4,1.791,4,4S42.209,80,40,80z"
    />
  </svg>
)

Spinner.displayName = 'Spinner'
