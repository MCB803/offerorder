import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Drawer, List, ListItem, ListItemButton, ListItemText, Box, Button, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navLinks = [
        { label: "Routes", path: "/routes" },
        ...(user?.role === "ROLE_ADMIN" ? [
            { label: "Locations", path: "/locations" },
            { label: "Transportations", path: "/transportations" }
        ] : [])
    ];

    return (
        <Box display="flex" minHeight="100vh">
            {}
            <Drawer
                variant="permanent"
                sx={{
                    width: 250,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 250,
                        boxSizing: 'border-box',
                        backgroundColor: '#C8102E',
                        color: 'white',
                        padding: '1rem'
                    }
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                    Offer Order Project
                </Typography>
                <List>
                    {navLinks.map(({ label, path }) => (
                        <ListItem key={path} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={path}
                                selected={location.pathname === path}
                                sx={{
                                    color: 'white',
                                    '&.Mui-selected': { backgroundColor: 'rgba(255,255,255,0.3)' }
                                }}
                            >
                                <ListItemText primary={label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                {}
                <Box sx={{ position: 'absolute', bottom: 20, left: 0, width: '100%', textAlign: 'center' }}>
                    <Button
                        onClick={logout}
                        variant="contained"
                        sx={{
                            backgroundColor: 'white',
                            color: '#C8102E',
                            '&:hover': { backgroundColor: '#F8F9FA' }
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default Dashboard;