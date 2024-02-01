import React, { useState } from 'react';
import { Typography, Button, TextField, Container } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const PaymentPage = ({ handlePayment }) => {
    const location = useLocation();
    const selectedPlan = location.state ? location.state.selectedPlan : 'No Plan Selected';
    const navigate = useNavigate();

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle payment processing
        handlePayment(paymentInfo);
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


