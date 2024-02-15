import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';

const UserInfo = () => {
    const [userData, setUserData] = useState(null);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the user ID from local storage
        const userId = localStorage.getItem('userId');

        // Function to fetch user information from the backend
        const fetchUserData = async () => {
            try {
                // Make a GET request to the "/userInfo" endpoint with the user ID as a parameter
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/userInfo/${userId}`);

                // Update the state with the user information received from the backend
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user information:', error);
            }
        };

        // Call the fetchUserData function when the component mounts
        fetchUserData();
    }, []); // Empty dependency array ensures the effect runs only once

    const handleUpdatePassword = () => {
        // Redirect to ProfileUser.js
        navigate('/updatePassword');
    };
    
    const handleDowngrade = async () => { 
        handleConfirmationDialogClose()
        try { 
            const response = await axios.post( 
                `${process.env.REACT_APP_BASE_URL}/updateAccount`, 
                { 
                    newAccountType: "Basic", 
                    userId: userData._id, 
                } 
            ); 

            if (response.status === 200) { 
                // Update user data after successful downgrade 
                setUserData({ ...userData, account_type: "Basic" }); 
                localStorage.setItem( 
                    "userData", 
                    JSON.stringify({ ...userData, account_type: "Basic" }) 
                ); 
                setSnackbarOpen(true); // Open Snackbar for success message
            } else { 
                throw new Error(`Failed to downgrade: ${response.statusText}`); 
            } 
        } catch (error) { 
            console.error("Error downgrading account:", error); 
        } 
    }; 

    const handleConfirmationDialogOpen = () => {
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div className="user-info-container">
            <Typography variant="h4" gutterBottom>User Information</Typography>
            {userData ? (
                <div className="user-info">
                    <TableContainer component={Paper}>
                        <Table aria-label="user information">
                            <TableBody>
                                <TableRow>
                                    <TableCell><strong>Email:</strong></TableCell>
                                    <TableCell>{userData.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Username:</strong></TableCell>
                                    <TableCell>{userData.username}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Account Type:</strong></TableCell>
                                    <TableCell>{userData.account_type}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
        
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button 
                            onClick={handleUpdatePassword} 
                            variant="contained" 
                            color="primary"  
                            style={{ 
                                marginLeft: "10px",
                                backgroundColor: "#321FDE" 
                            }} 
                        >
                            Update Password
                        </Button> 
                        {userData.account_type === "Professional" && ( 
                            <Button 
                                onClick={handleConfirmationDialogOpen} 
                                variant="contained" 
                                color="secondary" 
                                style={{ 
                                    marginLeft: "10px",
                                    backgroundColor: "black" 
                                }} 
                            > 
                                End Subscription
                            </Button> 
                        )}
                    </Box>
                    {/* Confirmation dialog for downgrade */}
                    <Dialog open={confirmationDialogOpen} onClose={handleConfirmationDialogClose}>
                        <DialogTitle>Confirmation</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">Are you sure you want to end your subscription?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleConfirmationDialogClose} color="primary">Cancel</Button>
                            <Button onClick={handleDowngrade} color="secondary">Confirm</Button>
                        </DialogActions>
                    </Dialog>
                    {/* Snackbar for success message */}
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={handleSnackbarClose}
                        message="Subscription ended successfully"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                    />
                </div>
            ) : (
                <Typography variant="body1" className="no-user-data">No user data available.</Typography>
            )}
        </div>
    );
};

export default UserInfo;
