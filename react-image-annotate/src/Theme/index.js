// @flow

import React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles((theme) => ({
  container: {
    fontFamily: '"Quicksand", sans-serif',
  },
}))

const theme = createTheme({
  overrides: {
    MuiButton: {
      root: {
        textTransform: "none",
      },
    },
  },
})

export const Theme = ({ children }: any) => {
  const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
      {/* <div className={classes.container}>{children}</div> */}
      <div>{children}</div>
    </ThemeProvider>
  )
}

export default Theme
