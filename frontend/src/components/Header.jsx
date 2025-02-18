import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: "#232b38" }}>
            <Toolbar>
                <Typography variant="h6" component="div">
                    Route Finder
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
