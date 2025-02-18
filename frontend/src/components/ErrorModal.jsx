import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const ErrorModal = ({ open, onClose, errorMessage }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
                <Typography color="error">{errorMessage}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ErrorModal;
