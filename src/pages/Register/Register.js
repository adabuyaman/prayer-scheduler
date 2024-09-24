import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Link, Snackbar, Alert } from '@mui/material';
import { auth } from '../../firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous error messages
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Handle successful signup (e.g., redirect user)
            navigate('/weekly-tasks'); // Redirect to weekly tasks after signup
        } catch (error) {
            console.error("Error signing up:", error);
            setErrorMessage(error.code); // Set error message
            setOpenSnackbar(true); // Open the Snackbar to show the error
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container component={Paper} style={{ padding: '20px', marginTop: '50px', maxWidth: '400px' }}>
            <Typography variant="h5" gutterBottom>Sign Up</Typography>
            <form onSubmit={handleSignup}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    error={!!errorMessage} // Highlight error if there is an error
                    helperText={errorMessage} // Display error message
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <LoadingButton variant="contained" color="primary" type="submit" fullWidth>
                    Sign Up
                </LoadingButton>
            </form>
            <Typography variant="body2" style={{ marginTop: '10px', textAlign: 'center' }}>
                Already have an account?
                <Link href="#" onClick={() => navigate('/login')} style={{ marginLeft: '5px' }}>
                    Log In
                </Link>
            </Typography>

            {/* Snackbar for error messages */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Signup;
