import React, { useState, useContext, useEffect } from 'react';
import { Typography, Button, TextField, Container } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
    const location = useLocation();
    const selectedPlan = location.state ? location.state.selectedPlan : 'No Plan Selected';
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

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

            // Your payment processing logic goes here

            // Send a request to update the user account type
            const response = await axios.put(`http://localhost:5050/update-account/${encodeURIComponent(userId)}`, {
                newAccountType: selectedPlan,
            });

            if (!response.data) {
                throw new Error(`Failed to update: ${response.statusText}`);
            }

            // After successful payment and account update, navigate to a confirmation page
            navigate('/UserInfo');
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    
    const handleCancel = () => {
        navigate("/PricingPage");

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
                />
                <TextField
                    name="expirationDate"
                    label="Expiration Date"
                    value={paymentInfo.expirationDate}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
                <TextField
                    name="cvv"
                    label="CVV"
                    value={paymentInfo.cvv}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
                <TextField
                    name="nameOnCard"
                    label="Name on Card"
                    value={paymentInfo.nameOnCard}
                    onChange={handleInputChange}
                    fullWidth
                    required
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
        </Container>
    );
};

export default PaymentPage;


