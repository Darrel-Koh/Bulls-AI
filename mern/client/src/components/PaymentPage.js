import React, { useState, useContext, useEffect } from 'react';
import { Typography, Button, TextField, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
    const location = useLocation();
    const selectedPlan = location.state ? location.state.selectedPlan : 'No Plan Selected';
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        // Retrieve user ID from localStorage
        const storedUserId = localStorage.getItem('userId');
        console.log('User ID from localStorage:', storedUserId);
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);
    

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        nameOnCard: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo({ ...paymentInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Check if userId is not null before accessing properties
            if (!userId) {
                console.error('User ID not found in localStorage', userId);
                return;
            }
    
            // Send a request to update the user account type
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/updateAccount`, {
                newAccountType: "Professional", // Update the account type to "Professional"
                userId: userId // Pass the userId to the server
            });
    
            if (response.status === 200) {
                // After successful account update, navigate to a confirmation page
                setDialogOpen(true);
                navigate('/UserInfo');
            } else {
                throw new Error(`Failed to update: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };
    

    
    const handleCancel = () => {
        navigate("/PricingPage");

    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };


    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h4" style={{ marginBottom: '20px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
                Payment for {selectedPlan}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    name="cardNumber"
                    label="Card Number"
                    value={paymentInfo.cardNumber}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{ marginBottom: '10px' }} // Add margin at the bottom
                />
                <TextField
                    name="expirationDate"
                    label="Expiration Date"
                    value={paymentInfo.expirationDate}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{ marginBottom: '10px' }} // Add margin at the bottom
                />
                <TextField
                    name="cvv"
                    label="CVV"
                    value={paymentInfo.cvv}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{ marginBottom: '10px' }} // Add margin at the bottom
                />
                <TextField
                    name="nameOnCard"
                    label="Name on Card"
                    value={paymentInfo.nameOnCard}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{ marginBottom: '20px' }} // Add larger margin at the bottom
                />
                <div style={{ marginTop: '20px' }}>
                    <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
                        Pay Now
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Account Updated</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Your account has been updated successfully.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PaymentPage;


