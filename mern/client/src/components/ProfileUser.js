import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Container, TextField } from '@mui/material';

const ProfileUser = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [newProfilePicture, setNewProfilePicture] = useState(null);

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleProfilePictureChange = (e) => setNewProfilePicture(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setTimeout(() => {
            // Update profile picture if a new one is selected
            if (newProfilePicture) {
                const reader = new FileReader();
                reader.onload = () => {
                    setProfilePicture(reader.result);
                };
                reader.readAsDataURL(newProfilePicture);
            }

            // Clear form fields or update state as needed
            setEmail('');
            setUsername('');
            setPassword('');
            setNewProfilePicture(null);
        }, 1000);
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '30px' }}>
            <Typography variant="h4" align="center" gutterBottom>User Profile</Typography>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img
                    src={profilePicture || 'https://placekitten.com/150/150'}
                    alt="Profile"
                    style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '4px solid #4caf50',
                    }}
                />

                
            </div>
          
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    fullWidth
                    variant="outlined"
                    style={{ marginBottom: '20px' }}
                />

                <TextField
                    label="Username"
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    fullWidth
                    variant="outlined"
                    style={{ marginBottom: '20px' }}
                />

                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    fullWidth
                    variant="outlined"
                    style={{ marginBottom: '20px' }}
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ width: '100%', padding: '8px', fontSize: '16px', marginBottom: '20px' }}
                />

                <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
                    Save Changes
                </Button>

                <Button component={Link} to="/PricingPage" variant="contained" color="success">
                    Upgrade Plan
                </Button>
            </form>

           
        </Container>
    );
};

export default ProfileUser;