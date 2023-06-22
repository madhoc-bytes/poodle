import react from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const NavBar = () => {
    // Need to do react router to profile page
    return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Poodle
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    profile
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
