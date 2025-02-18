import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Select, MenuItem, FormControl, InputLabel,
    FormControlLabel, Checkbox, Box, Typography
} from '@mui/material';

const TRANSPORTATION_TYPES = ['BUS', 'FLIGHT', 'UBER', 'SUBWAY'];
const WEEKDAYS = [
    { id: 1, name: 'Monday' }, { id: 2, name: 'Tuesday' }, { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' }, { id: 5, name: 'Friday' }, { id: 6, name: 'Saturday' }, { id: 7, name: 'Sunday' }
];

const EditTransportationModal = ({ open, onClose, transport, locations, onSave, onChange }) => {
    if (!transport) return null;

    const handleCheckboxChange = (dayId) => {
        onChange({
            ...transport,
            operatingDays: transport.operatingDays.includes(dayId)
                ? transport.operatingDays.filter(d => d !== dayId)
                : [...transport.operatingDays, dayId]
        });
    };

    const handleSelectAll = (event) => {
        onChange({
            ...transport,
            operatingDays: event.target.checked ? WEEKDAYS.map(d => d.id) : []
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Edit Transportation</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Origin</InputLabel>
                    <Select
                        value={transport.originId}
                        onChange={(e) => onChange({ ...transport, originId: e.target.value })}
                    >
                        {locations.map(loc => (
                            <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Destination</InputLabel>
                    <Select
                        value={transport.destinationId}
                        onChange={(e) => onChange({ ...transport, destinationId: e.target.value })}
                    >
                        {locations.map(loc => (
                            <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={transport.type}
                        onChange={(e) => onChange({ ...transport, type: e.target.value })}
                    >
                        {TRANSPORTATION_TYPES.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box mt={2}>
                    <Typography variant="subtitle1">Operating Days</Typography>
                    <FormControlLabel
                        control={<Checkbox checked={transport.operatingDays.length === WEEKDAYS.length} onChange={handleSelectAll} />}
                        label="Select All"
                    />
                    {WEEKDAYS.map(day => (
                        <FormControlLabel
                            key={day.id}
                            control={
                                <Checkbox
                                    checked={transport.operatingDays.includes(day.id)}
                                    onChange={() => handleCheckboxChange(day.id)}
                                />
                            }
                            label={day.name}
                        />
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={onSave} color="primary" variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditTransportationModal;
