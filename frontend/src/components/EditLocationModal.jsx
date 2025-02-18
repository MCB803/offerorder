import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const EditLocationModal = ({ open, onClose, location, onChange, onSave }) => {
    if (!location) return null;

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={location.name}
                    onChange={onChange}
                    required
                    margin="dense"
                />
                <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    value={location.country}
                    onChange={onChange}
                    required
                    margin="dense"
                />
                <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={location.city}
                    onChange={onChange}
                    required
                    margin="dense"
                />
                <TextField
                    fullWidth
                    label="Location Code"
                    name="locationCode"
                    value={location.locationCode}
                    onChange={onChange}
                    margin="dense"
                />
                <TextField
                    fullWidth
                    label="Latitude"
                    name="latitude"
                    value={location.latitude}
                    type="number"
                    onChange={onChange}
                    margin="dense"
                />
                <TextField
                    fullWidth
                    label="Longitude"
                    name="longitude"
                    value={location.longitude}
                    type="number"
                    onChange={onChange}
                    margin="dense"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onSave} variant="contained" color="primary">Save</Button>
                <Button onClick={onClose} variant="contained" color="secondary">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditLocationModal;
