import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Card,
    Typography
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import RouteMap from "../components/RouteMap";

const transportColors = {
    FLIGHT: "red",
    BUS: "blue",
    SUBWAY: "green",
    UBER: "purple"
};

const RoutesPage = () => {
    const [locations, setLocations] = useState([]);
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [tripDate, setTripDate] = useState("");
    // Use groupedRoutes instead of a simple routes array
    const [groupedRoutes, setGroupedRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [error, setError] = useState("");
    const [overlayOpen, setOverlayOpen] = useState(false);

    useEffect(() => {
        axiosInstance
            .get("/api/routes/locations")
            .then((response) => {
                setLocations(response.data.payload || []);
            })
            .catch(() => {
                setError("Failed to fetch locations");
            });
    }, []);

    useEffect(() => {
        setSelectedRoute(null);
        setOverlayOpen(false);
    }, [origin, destination, tripDate]);

    const handleSwitchPorts = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    const handleSearch = () => {
        if (!origin || !destination || origin === destination || !tripDate) {
            setError("Please select valid origin, destination, and date.");
            return;
        }
        setError("");

        // Call the new grouped endpoint
        axiosInstance
            .get("/api/routes/grouped", {
                params: { originId: origin, destinationId: destination, tripDate }
            })
            .then((response) => {
                setGroupedRoutes(response.data.payload || []);
            })
            .catch(() => {
                setError("Error fetching routes");
            });
    };

    const getRouteSummary = (route) => {
        if (!route.length) return "Invalid route data";
        const flightSegment = route.find(
            (seg) => seg.type?.toUpperCase() === "FLIGHT"
        );
        return flightSegment
            ? `Via ${flightSegment.origin.name}`
            : `Route from ${route[0].origin.name}`;
    };

    const handleRouteSelect = (route) => {
        setSelectedRoute(route);
        setOverlayOpen(true);
    };

    const renderRouteDetails = (route) => {
        if (!route || route.length === 0) return null;

        const stops = [];
        stops.push({
            name: route[0].origin.name,
            code: route[0].origin.locationCode,
            type: null
        });
        route.forEach((segment) => {
            stops.push({
                name: segment.destination.name,
                code: segment.destination.locationCode,
                type: segment.type
            });
        });

        return (
            <Box sx={{ p: 2, width: "100%", overflowY: "auto" }}>
                {stops.map((stop, index) => {
                    const circleColor = "gray";
                    return (
                        <Box key={index}>
                            <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                                <Box
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        border: `3px solid ${circleColor}`,
                                        backgroundColor: "#fff",
                                        mr: 2
                                    }}
                                />
                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {stop.name}
                                    </Typography>
                                    {stop.code && (
                                        <Typography variant="caption" color="gray">
                                            ({stop.code})
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                            {index < stops.length - 1 && (
                                <Box
                                    sx={{
                                        position: "relative",
                                        ml: 2.1,
                                        borderLeft: `3px dashed ${
                                            transportColors[stops[index + 1].type?.toUpperCase()] || "gray"
                                        }`,
                                        height: 80,
                                        mt: 1,
                                        mb: 2
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "20px",
                                            transform: "translateY(-50%)"
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color:
                                                    transportColors[stops[index + 1].type?.toUpperCase()] || "gray",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {stops[index + 1].type?.toUpperCase() || ""}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>
        );
    };

    const handleCloseOverlay = () => {
        setOverlayOpen(false);
        setSelectedRoute(null);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Search Routes
            </Typography>

            <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel id="origin-label">Origin</InputLabel>
                        <Select
                            labelId="origin-label"
                            label="Origin"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                        >
                            <MenuItem value="" disabled>
                                Select Origin
                            </MenuItem>
                            {locations.map((loc) => (
                                <MenuItem key={loc.id} value={loc.id} disabled={loc.id === destination}>
                                    {loc.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={1} container justifyContent="center">
                    <Button
                        variant="contained"
                        onClick={handleSwitchPorts}
                        sx={{
                            minWidth: "40px",
                            height: "56px",
                            backgroundColor: "#C8102E",
                            color: "white",
                            "&:hover": { backgroundColor: "#A50E1A" }
                        }}
                    >
                        ⇄
                    </Button>
                </Grid>

                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel id="destination-label">Destination</InputLabel>
                        <Select
                            labelId="destination-label"
                            label="Destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        >
                            <MenuItem value="" disabled>
                                Select Destination
                            </MenuItem>
                            {locations.map((loc) => (
                                <MenuItem key={loc.id} value={loc.id} disabled={loc.id === origin}>
                                    {loc.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={3}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Trip Date"
                        value={tripDate}
                        onChange={(e) => setTripDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                <Grid item xs={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                            height: "56px",
                            backgroundColor: "#C8102E",
                            "&:hover": { backgroundColor: "#A50E1A" }
                        }}
                    >
                        Search
                    </Button>
                </Grid>
            </Grid>

            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}

            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Available Routes
                </Typography>
                {groupedRoutes.length > 0 ? (
                    groupedRoutes.map((group, groupIndex) => (
                        <Box key={groupIndex} sx={{ mb: 3 }}>
                            {/* City header to indicate group */}
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                                {group.city}
                            </Typography>
                            {group.routes.map((route, routeIndex) => (
                                <Card
                                    key={routeIndex}
                                    onClick={() => handleRouteSelect(route)}
                                    sx={{
                                        p: 2,
                                        mt: 1,
                                        cursor: "pointer",
                                        bgcolor: selectedRoute === route ? "#f0f0f0" : "white"
                                    }}
                                >
                                    {getRouteSummary(route)}
                                </Card>
                            ))}
                        </Box>
                    ))
                ) : (
                    <Typography>No routes found.</Typography>
                )}
            </Box>

            {overlayOpen && selectedRoute && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        bgcolor: "rgba(0, 0, 0, 0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1300
                    }}
                    onClick={handleCloseOverlay}
                >
                    <Box
                        sx={{
                            backgroundColor: "white",
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            width: { xs: "90vw", md: "80vw" },
                            height: { xs: "80vh", md: "70vh" },
                            borderRadius: "8px",
                            overflow: "hidden",
                            position: "relative"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Box sx={{ flex: 2, position: "relative" }}>
                            <RouteMap route={selectedRoute} />
                        </Box>
                        <Box
                            sx={{
                                flex: 0.8,
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography variant="h6" gutterBottom align="center">
                                Route Details
                            </Typography>
                            {renderRouteDetails(selectedRoute)}
                            <Button
                                variant="contained"
                                onClick={handleCloseOverlay}
                                sx={{
                                    mt: 2,
                                    width: "80%",
                                    backgroundColor: "#C8102E",
                                    fontSize: "0.8rem",
                                    "&:hover": { backgroundColor: "#A50E1A" }
                                }}
                            >
                                Close
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default RoutesPage;
