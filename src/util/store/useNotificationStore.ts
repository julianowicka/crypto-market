import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../api/QueryKeys";

interface NotificationModel {
    isError: boolean,
    errorMessage: string,
}

const INITIAL_NOTIFICATION_STATE: NotificationModel = {
    isError: false,
    errorMessage: '',
}

export const useNotificationStore = () => {
    const { data } = useQuery({
        queryKey: [QueryKeys.GET_NOTIFICATIONS],
        queryFn: () => INITIAL_NOTIFICATION_STATE,
        initialData: INITIAL_NOTIFICATION_STATE,
    })
    const notificationState = data ?? INITIAL_NOTIFICATION_STATE

    const queryClient = useQueryClient()

    const openErrorMessage = (errorMessage: string) => {
        queryClient.setQueryData([QueryKeys.GET_NOTIFICATIONS], {
            isError: true,
            errorMessage,
        })
    }

    const closeErrorMessage = () => {
        queryClient.setQueryData([QueryKeys.GET_NOTIFICATIONS], INITIAL_NOTIFICATION_STATE)
    }

    return {
        notificationState,
        openErrorMessage,
        closeErrorMessage,
    }
}
