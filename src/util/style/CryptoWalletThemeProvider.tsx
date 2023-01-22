import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";

const theme = createTheme({
    components: {
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
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "21px",
                }
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
        MuiTableRow: {
            styleOverrides: {
                root: {
                    borderRadius: "10px",
                    margin: "10px 0 10px 0",
                    padding: "10px 0 10px 0",
                    background: "#212246",
                    "& td:first-child": {
                        padding: "10px",
                        borderTopLeftRadius: "10px",
                        borderBottomLeftRadius: "10px",
                    },
                    "& td": {
                        background: "#212246",
                    },
                    "& div": {
                        background: "#212246",
                    }
                }
            }
        }
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

export const CryptoWalletThemeProvider: React.FC<Props> = (props) => {
    const { children } = props
    return (
        <ThemeProvider theme={ theme }>{ children }</ThemeProvider>
    )
}