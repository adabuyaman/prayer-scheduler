import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config'; // Adjust the import path as needed
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    AccordionDetails,
    Accordion,
    AccordionSummary,
} from '@mui/material';
import WeeklyTasksTable from "../../components/WeeklyTasks/WeeklyTasks";
import {getLastDayOfWeek} from "../../utils/dates";
import {useAuth} from "../../auth/auth";
import {Navigate} from "react-router-dom";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const {isAdmin} = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [weeks, setWeeks] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {

            const querySnapshot = await getDocs(collection(db, "weekly_tasks"));
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
            });

            try {
                const querySnapshot = await getDocs(collection(db, 'weekly_tasks'));
                console.log(querySnapshot.docs)
                const userArray = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(userArray);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        fetchUsers();
    }, []);

    const fetchWeeksForUser = async (user) => {
        console.log(user)
        const userId = user.id;
        try {
            const userWeeksRef = collection(db, 'weekly_tasks', userId, 'tasks');
            const querySnapshot = await getDocs(userWeeksRef);
            const weekArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setWeeks(weekArray);
            setSelectedUser(user);
        } catch (error) {
            console.error("Error fetching weeks: ", error);
        }
    };

    const handleExpandingWeek = (weekId) => {
        setSelectedWeek(weekId);
    }

    if(!isAdmin) return <Navigate to='/tasks'/>

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Admin User Management
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User ID</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Button variant="contained" onClick={() => fetchWeeksForUser(user)}>
                                        View Weeks
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedUser && (
                <div style={{ marginTop: '20px' }}>
                    <Typography variant="h5">Weeks for User: {selectedUser?.email}</Typography>
                    {weeks.map(week => (
                        <Accordion key={week.id} expanded={selectedWeek === week.id} onChange={()=>handleExpandingWeek(week.id)}>
                            <AccordionSummary
                                // expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                {`${week.id} - ${getLastDayOfWeek(week.id)}`}
                            </AccordionSummary>
                            <AccordionDetails>
                                <WeeklyTasksTable
                                    tasksValue={week.tasks}
                                />
                            </AccordionDetails>
                        </Accordion>
                        )
                    )}
                </div>
            )}
        </Container>
    );
};

export default AdminPage;
