import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import ErrorModal from '../components/ErrorModal';
import EditLocationModal from '../components/EditLocationModal';
import {
    Table, TableHead, TableBody, TableRow, TableCell, Button, TextField,
    Box, Typography
} from '@mui/material';

const LocationsPage = () => {
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState('');
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [newLocation, setNewLocation] = useState({
        name: '', country: '', city: '', locationCode: '', latitude: '', longitude: ''
    });

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await axiosInstance.get('/api/locations');
            setLocations(response.data.payload);
        } catch (err) {
            handleError('Failed to fetch locations');
        }
    };

    const handleError = (message) => {
        setError(message);
        setErrorModalOpen(true);
    };

    const handleNewChange = (e) => {
        setNewLocation({ ...newLocation, [e.target.name]: e.target.value });
    };

    const handleAddLocation = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/locations', newLocation);
            fetchLocations();
            setNewLocation({ name: '', country: '', city: '', locationCode: '', latitude: '', longitude: '' });
        } catch (err) {
            handleError('Failed to add location');
        }
    };

    const handleDeleteLocation = async (id) => {
        try {
            await axiosInstance.delete(`/api/locations/${id}`);
            fetchLocations();
        } catch (err) {
            handleError('Failed to delete location');
        }
    };

    const handleEditLocation = (loc) => {
        setSelectedLocation({ ...loc });
        setEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        setSelectedLocation({ ...selectedLocation, [e.target.name]: e.target.value });
    };

    const handleUpdateLocation = async () => {
        try {
            await axiosInstance.put(`/api/locations/${selectedLocation.id}`, selectedLocation);
            fetchLocations();
            setEditModalOpen(false);
        } catch (err) {
            handleError('Failed to update location');
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredLocations = locations.filter(loc =>
        loc.name.toLowerCase().includes(filter.toLowerCase()) ||
        loc.city.toLowerCase().includes(filter.toLowerCase()) ||
        loc.country.toLowerCase().includes(filter.toLowerCase()) ||
        loc.locationCode?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Locations Management</Typography>

            <form onSubmit={handleAddLocation}>
                <Box display="flex" gap={2} mb={2}>
                    <TextField fullWidth label="Name" name="name" value={newLocation.name} onChange={handleNewChange} required />
                    <TextField fullWidth label="Country" name="country" value={newLocation.country} onChange={handleNewChange} required />
                    <TextField fullWidth label="City" name="city" value={newLocation.city} onChange={handleNewChange} required />
                    <TextField fullWidth label="Location Code" name="locationCode" value={newLocation.locationCode} onChange={handleNewChange} />
                </Box>
                <Box display="flex" gap={2} mb={2}>
                    <TextField fullWidth label="Latitude" name="latitude" type="number" value={newLocation.latitude} onChange={handleNewChange} />
                    <TextField fullWidth label="Longitude" name="longitude" type="number" value={newLocation.longitude} onChange={handleNewChange} />
                </Box>
                <Button type="submit" variant="contained" color="primary">Add Location</Button>
            </form>

            <TextField label="Filter by Name, City, Country, or Code" value={filter} onChange={handleFilterChange} fullWidth margin="normal" />

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>Location Code</TableCell>
                        <TableCell>Latitude</TableCell>
                        <TableCell>Longitude</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredLocations.map(loc => (
                        <TableRow key={loc.id}>
                            <TableCell>{loc.name}</TableCell>
                            <TableCell>{loc.country}</TableCell>
                            <TableCell>{loc.city}</TableCell>
                            <TableCell>{loc.locationCode || 'N/A'}</TableCell>
                            <TableCell>{loc.latitude || 'N/A'}</TableCell>
                            <TableCell>{loc.longitude || 'N/A'}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleEditLocation(loc)} variant="outlined">Edit</Button>
                                <Button onClick={() => handleDeleteLocation(loc.id)} variant="outlined" color="error">Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <EditLocationModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                location={selectedLocation}
                onChange={handleEditChange}
                onSave={handleUpdateLocation}
            />
            <ErrorModal open={errorModalOpen} onClose={() => setErrorModalOpen(false)} errorMessage={error} />
        </Box>
    );
};

export default LocationsPage;
