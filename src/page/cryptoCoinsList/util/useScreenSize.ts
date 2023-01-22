import { useMediaQuery, useTheme } from "@mui/material";

export const useScreenSize = () => {
    const theme = useTheme();

    const handHeld = useMediaQuery(theme.breakpoints.down("md"));
    const mobile = useMediaQuery(theme.breakpoints.down("sm"));
    const desktop = useMediaQuery(theme.breakpoints.up("sm"));
    const largeDesktop = useMediaQuery(theme.breakpoints.only("lg"));
    const tablet = useMediaQuery(theme.breakpoints.only("sm"));

    return {
        handHeld,
        mobile,
        desktop,
        largeDesktop,
        tablet,
    };
};
