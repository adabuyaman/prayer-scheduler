import React, {useState} from 'react';
import {signInWithEmailAndPassword } from 'firebase/auth';
import {Alert, Button, Container, Link, Paper, Snackbar, TextField, Typography} from "@mui/material";
import {auth} from "../../firebase.config";
import LoadingButton from '@mui/lab/LoadingButton';
import {useNavigate} from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setErrorMessage("Check your credentials and try again."); // Generic error message
            setOpenSnackbar(true); // Open the Snackbar to show the error
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container component={Paper} style={{ padding: '20px', marginTop: '50px', maxWidth: '400px' }}>
            <Typography variant="h5" gutterBottom>Login</Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    disabled={isLoading}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    disabled={isLoading}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <LoadingButton loading={isLoading} variant="contained" color="primary" type="submit" fullWidth>
                    Login
                </LoadingButton>
            </form>

            <Typography variant="body2" style={{ marginTop: '10px', textAlign: 'center' }}>
                Don't have an account?
                <Link href="#" onClick={() => navigate('/register')} style={{ marginLeft: '5px' }}>
                    Sign Up
                </Link>
            </Typography>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Login;