import { useWindowWidth, } from '@react-hook/window-size'

export const useWindowSize = () => {
    const width = useWindowWidth()
    const isDesktop = width > 1200
    const isTablet = width <= 1200 && width > 815
    const isMobile = width <= 815
    const isSuperSmall = width < 500

    return {
        isDesktop,
        isTablet,
        isMobile,
        isSuperSmall,
    }
}