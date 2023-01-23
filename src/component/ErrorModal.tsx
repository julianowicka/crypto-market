import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNotificationStore } from "../util/store/useNotificationStore";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxWidth: "70vw",
    backgroundColor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export const ErrorModal: React.FC = () => {
    const { notificationState, closeErrorMessage } = useNotificationStore()


    return (
        <div>
            <Modal
                open={ notificationState.isError }
                onClose={ closeErrorMessage }
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={ style }>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Error
                    </Typography>
                    <Typography
                        id="modal-modal-description"
                        sx={ { mt: 2 } }
                    >
                        { notificationState.errorMessage }
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}