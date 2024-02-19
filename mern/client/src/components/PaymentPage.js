import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, Container, Snackbar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
    const location = useLocation();
    const selectedPlan = location.state ? location.state.selectedPlan : 'No Plan Selected';
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

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

        // Perform basic validation checks
        if (!isValidCardNumber(paymentInfo.cardNumber) || !isValidExpirationDate(paymentInfo.expirationDate) || !isValidCVV(paymentInfo.cvv) || !isValidNameOnCard(paymentInfo.nameOnCard)) {
            console.error('Validation failed. Please check your inputs.');
            setSnackbarMessage('Validation failed. Please check your inputs.');
            setSnackbarOpen(true);
            return;
        }
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
                // After successful account update, show Snackbar for success message
                setSnackbarMessage('Account type updated.');
                setSnackbarOpen(true);;
                setTimeout(() => {
                    navigate('/UserInfo');
                }, 4000);
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

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

  // Function to validate the card number format
const isValidCardNumber = (cardNumber) => {
    // Check if the card number is empty
    if (!cardNumber) {
        setSnackbarMessage('Please enter a valid card number with 13 to 16 digits.');
        setSnackbarOpen(true);
        return false;
    }

    // Remove spaces and dashes from the card number
    const strippedCardNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');

    // Validate the card number using a regular expression
    const cardNumberRegex = /^[0-9]{13,16}$/;
    if (!cardNumberRegex.test(strippedCardNumber)) {
        setSnackbarMessage('Please enter a valid card number with 13 to 16 digits.');
        setSnackbarOpen(true);
        return false;
    }

    return true;
};

// Function to validate the expiration date format and ensure it's in the future
const isValidExpirationDate = (expirationDate) => {
    // Check if the expiration date is empty
    if (!expirationDate) {
        setSnackbarMessage('Please enter a valid expiration date in the format MM/YYYY.');
        setSnackbarOpen(true);
        return false;
    }

    // Split the expiration date into month and year
    const [month, year] = expirationDate.split('/').map((part) => parseInt(part, 10));

    // Validate the expiration date format and ensure it's in the future
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last two digits of the current year

    if (
        !(month >= 1 && month <= 12) ||
        !(year >= currentYear) ||
        !((year > currentYear) || (year === currentYear && month > (currentDate.getMonth() + 1)))
    ) {
        setSnackbarMessage('Please enter a valid expiration date in the format MM/YYYY.');
        setSnackbarOpen(true);
        return false;
    }

    return true;
};

// Function to validate the CVV format based on the card type
const isValidCVV = (cvv) => {
    // Check if the CVV is empty
    if (!cvv) {
        setSnackbarMessage('Please enter a valid CVV with 3 to 4 digits.');
        setSnackbarOpen(true);
        return false;
    }

    // Validate the CVV format based on the card type
    const cvvRegex = /^[0-9]{3,4}$/;
    if (!cvvRegex.test(cvv)) {
        setSnackbarMessage('Please enter a valid CVV with 3 to 4 digits.');
        setSnackbarOpen(true);
        return false;
    }

    return true;
};

// Function to validate the name on the card
const isValidNameOnCard = (nameOnCard) => {
    // Check if the name on card is empty
    if (!nameOnCard.trim()) {
        setSnackbarMessage('Please enter the name on the card.');
        setSnackbarOpen(true);
        return false;
    }

    return true;
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
            {/* Snackbar for success message
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message="Payment Successful"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            /> */}
                        <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
/>
        </Container>
    );
};

export default PaymentPage;
