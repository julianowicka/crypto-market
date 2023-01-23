import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";

const theme = createTheme({
    components: {
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: "#838C9E",
                    borderRadius: "10px",
                    padding: "15px 0 15px 0",
                    color: "#212246",
                    fontWeight: "700",
                    fontSize: "16px",
                    lineHeight: "23px",
                    fontStyle: "normal",
                    "div&:hover:not(.Mui-disabled, .Mui-error):before, div&:hover:not(.Mui-disabled, .Mui-error):after": {
                        borderWidth: "0px",
                    },
                    "div&:after": {
                        borderWidth: "0px",
                    },
                }
            }
        },
        MuiInputAdornment: {
            styleOverrides: {
                root: {
                    backgroundColor: "transparent",
                    margin: "0 7px 0 12px",
                    color: "#212246",
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                h3: {
                    fontStyle: "normal",
                    fontWeight: "600",
                    fontSize: "24px",
                    lineHeight: "36px",
                    color: "#FFFFFF"
                }
            }
        },
        MuiToggleButton: {
            styleOverrides: {
                primary: {
                    color: "#FFFFFF",
                },
                root: {
                    color: "#838C9E",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    "&.Mui-selected": {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        borderBottomWidth: "1px",
                        borderBottomColor: "#0695FF",
                        borderBottomStyle: "solid",
                        borderRadius: "0"
                    }
                },
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    "& legend span": {
                        color: "#161730",
                    }
                },
                root: {
                    backgroundColor: "#838C9E",
                    color: "#161730",
                }
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: "#161730",
                    fontStyle: "normal",
                    fontWeight: "700",
                    fontSize: "25px",
                    lineHeight: "26px",
                    margin: "45px 0 0 40px",
                    transition: "margin 700ms, color 700ms !important",
                    "&.Mui-focused": {
                        margin: "0",
                        transition: "margin 700ms, color 700ms",
                        color: "#FFF"
                    }
                },
            }
        },
        MuiTablePagination: {
            styleOverrides: {
                actions: {
                    color: "#FFF"
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: "none"
                }
            }
        },
    },
    typography: {
        fontFamily: 'Poppins'
    },
    palette: {
        text: {
            primary: "#FFFFFF",
            secondary: "#FFFFFF",
            disabled: "#FFFFFF",
        },
        action: {
            disabled: "#838C9E"
        }
    },

});

interface Props {
    children: React.ReactNode,
}

export const CryptoMarketThemeProvider: React.FC<Props> = (props) => {
    const { children } = props
    return (
        <ThemeProvider theme={ theme }>{ children }</ThemeProvider>
    )
}