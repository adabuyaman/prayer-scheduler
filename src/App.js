import React, { useEffect, useState } from 'react';
import {
    Navigate,
    Outlet,
    RouterProvider,
    createBrowserRouter
} from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import WeeklyTasks from "./pages/WeeklyTasks/WeeklyTasks";
import {Box, CircularProgress} from "@mui/material";
import Navbar from "./components/Navbar/Navbar";
import AdminPage from "./pages/AdminPage/AdminPage";
import {AuthContext} from "./auth/auth";

const authenticatedRoutes = [
    {
        path: '/',
        element: <RootLayout  />,
        children: [
            { path: 'tasks', element: <WeeklyTasks/> },
            { path: 'admin', element: <AdminPage/> },
            { path: '/', element: <WeeklyTasks/> },
        ],
    },
    { path: '*', element: <Navigate to="/tasks" /> },
];

const unauthenticatedRoutes = [
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    { path: '*', element: <Navigate to="/login" /> }, // Redirect all unmatched routes to login
];


const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        const auth = getAuth();
        await signOut(auth);
    };

    if (loading) {
        return <Box sx={{ display: 'flex',height: '100vh',width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    }


    const routes = user ? authenticatedRoutes : unauthenticatedRoutes;
    const router = createBrowserRouter(routes);

    return (
        <AuthContext.Provider value={{user, logout}}>
            <RouterProvider router={router} />
        </AuthContext.Provider>
    );
};

// Root layout component containing the navigation and outlet
function RootLayout ({ onLogout }) {
    return (
        <div>
            <Navbar onLogout={onLogout} />
            <Box sx={{padding: 5}}>
            <Outlet />  {/* The child routes will be rendered here */}
            </Box>
        </div>
    );
};

export default App;