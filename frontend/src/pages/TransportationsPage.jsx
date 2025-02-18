import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import ErrorModal from '../components/ErrorModal';
import EditTransportationModal from '../components/EditTransportationModal';

import {
    Table, TableHead, TableBody, TableRow, TableCell, Select, MenuItem,
    Checkbox, Button, TextField, FormControlLabel, Box, Typography
} from '@mui/material';

const TRANSPORTATION_TYPES = ['BUS', 'FLIGHT', 'UBER', 'SUBWAY'];
const WEEKDAYS = [
    { id: 1, name: 'Monday' }, { id: 2, name: 'Tuesday' }, { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' }, { id: 5, name: 'Friday' }, { id: 6, name: 'Saturday' }, { id: 7, name: 'Sunday' }
];

const TransportationsPage = () => {
    const [transportations, setTransportations] = useState([]);
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const [selectedTransport, setSelectedTransport] = useState(null);
    const [newTrans, setNewTrans] = useState({ originId: '', destinationId: '', type: '', operatingDays: [] });

    useEffect(() => {
        fetchLocations();
        fetchTransportations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await axiosInstance.get('/api/locations');
            setLocations(response.data.payload);
        } catch (err) {
            handleError('Failed to fetch locations');
        }
    };

    const fetchTransportations = async () => {
        try {
            const response = await axiosInstance.get('/api/transportations');
            setTransportations(response.data.payload);
        } catch (err) {
            handleError('Failed to fetch transportations');
        }
    };

    const handleError = (message) => {
        setError(message);
        setModalOpen(true);
    };

    const handleNewChange = (e) => {
        setNewTrans({ ...newTrans, [e.target.name]: e.target.value });
    };

    const handleOperatingDaysChange = (dayId, isEdit = false) => {
        if (isEdit) {
            setSelectedTransport(prev => ({
                ...prev,
                operatingDays: prev.operatingDays.includes(dayId)
                    ? prev.operatingDays.filter(d => d !== dayId)
                    : [...prev.operatingDays, dayId]
            }));
        } else {
            setNewTrans(prev => ({
                ...prev,
                operatingDays: prev.operatingDays.includes(dayId)
                    ? prev.operatingDays.filter(d => d !== dayId)
                    : [...prev.operatingDays, dayId]
            }));
        }
    };

    const handleAddTransportation = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/transportations', newTrans);
            fetchTransportations();
            setNewTrans({ originId: '', destinationId: '', type: '', operatingDays: [] });
        } catch (err) {
            handleError('Failed to add transportation');
        }
    };

    const handleDeleteTransportation = async (id) => {
        try {
            await axiosInstance.delete(`/api/transportations/${id}`);
            fetchTransportations();
        } catch (err) {
            handleError('Failed to delete transportation');
        }
    };

    const handleEditTransportation = (trans) => {
        setSelectedTransport({
            id: trans.id,
            originId: trans.origin?.id || trans.origin,
            destinationId: trans.destination?.id || trans.destination,
            type: trans.type,
            operatingDays: trans.operatingDays || []
        });
        setEditModalOpen(true);
    };


    const handleUpdateTransportation = async () => {
        try {
            await axiosInstance.put(`/api/transportations/${selectedTransport.id}`, selectedTransport);
            fetchTransportations();
            setEditModalOpen(false);
        } catch (err) {
            handleError('Failed to update transportation');
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredTransportations = transportations.filter(trans =>
        trans.origin?.name.toLowerCase().includes(filter.toLowerCase()) ||
        trans.destination?.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Transportations Management</Typography>

            <form onSubmit={handleAddTransportation}>
                <Box display="flex" gap={2} mb={2}>
                    <Select fullWidth name="originId" value={newTrans.originId} onChange={handleNewChange} required>
                        <MenuItem value="">Select Origin</MenuItem>
                        {locations.map(loc => (
                            <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
                        ))}
                    </Select>

                    <Select fullWidth name="destinationId" value={newTrans.destinationId} onChange={handleNewChange} required>
                        <MenuItem value="">Select Destination</MenuItem>
                        {locations.map(loc => (
                            <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
                        ))}
                    </Select>

                    <Select fullWidth name="type" value={newTrans.type} onChange={handleNewChange} required>
                        <MenuItem value="">Select Type</MenuItem>
                        {TRANSPORTATION_TYPES.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </Box>

                {WEEKDAYS.map(day => (
                    <FormControlLabel
                        key={day.id}
                        control={<Checkbox checked={newTrans.operatingDays.includes(day.id)} onChange={() => handleOperatingDaysChange(day.id)} />}
                        label={day.name}
                    />
                ))}

                <Button type="submit" variant="contained" color="primary">Add Transportation</Button>
            </form>

            <TextField label="Filter by Name" value={filter} onChange={handleFilterChange} fullWidth margin="normal" />

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Origin</TableCell>
                        <TableCell>Destination</TableCell>
                        <TableCell>Operating Days</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredTransportations.map(trans => (
                        <TableRow key={trans.id}>
                            <TableCell>{trans.type}</TableCell>
                            <TableCell>{trans.origin?.name || 'N/A'}</TableCell>
                            <TableCell>{trans.destination?.name || 'N/A'}</TableCell>
                            <TableCell>
                                {trans.operatingDays.map(dayId => {
                                    const day = WEEKDAYS.find(w => w.id === dayId);
                                    return day ? day.name.slice(0, 3) : '';
                                }).join(', ')}
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => handleEditTransportation(trans)} variant="outlined">Edit</Button>
                                <Button onClick={() => handleDeleteTransportation(trans.id)} variant="outlined" color="error">Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <EditTransportationModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                transport={selectedTransport}
                locations={locations}
                onChange={setSelectedTransport}
                onSave={handleUpdateTransportation}
            />


            <ErrorModal open={modalOpen} onClose={() => setModalOpen(false)} errorMessage={error} />
        </Box>
    );
};

export default TransportationsPage;
