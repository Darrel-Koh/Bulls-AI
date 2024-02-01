import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

const UserInfo = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve user data from local storage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    const handleModify = () => {
        // Redirect to ProfileUser.js
        navigate('/ProfileUser');
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
                                    <TableCell><strong>ID:</strong></TableCell>
                                    <TableCell>{userData._id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Account Type:</strong></TableCell>
                                    <TableCell>{userData.account_type}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button onClick={handleModify} variant="contained" color="primary">Modify Information</Button>
                    </Box>
                </div>
            ) : (
                <Typography variant="body1" className="no-user-data">No user data available.</Typography>
            )}
        </div>
    );
};

export default UserInfo;