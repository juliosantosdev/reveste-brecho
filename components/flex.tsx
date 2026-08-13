"use client"

import * as React from "react"
import { Stack as MuiStack } from "@mui/material"
import type { StackProps } from "@mui/material"
import type { SxProps, Theme } from "@mui/material/styles"

type LayoutProps = {
  alignItems?: any
  justifyContent?: any
  flexWrap?: any
  color?: any
}

export type FlexStackProps = Omit<StackProps, "color"> & LayoutProps

/**
 * MUI 9's Stack only reads `direction`, `spacing`, `divider`, `useFlexGap`.
 * Layout props like alignItems/justifyContent/flexWrap/color leak to the DOM,
 * so this wrapper hoists them into `sx`.
 */
export function Stack({ alignItems, justifyContent, flexWrap, color, sx, ...rest }: FlexStackProps) {
  const hoisted: SxProps<Theme> = { alignItems, justifyContent, flexWrap, color }
  const sxArray = Array.isArray(sx) ? sx : [sx]
  return <MuiStack sx={[hoisted, ...sxArray] as SxProps<Theme>} {...rest} />
}
