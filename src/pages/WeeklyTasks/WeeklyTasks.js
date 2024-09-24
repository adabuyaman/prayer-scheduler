import React, { useState, useEffect } from 'react';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config'; // Firebase config
import {
    Container,
    Typography,
    Button,
    ButtonGroup
} from '@mui/material';
import LoadingButton from "@mui/lab/LoadingButton";
import WeeklyTasksTable from "../../components/WeeklyTasks/WeeklyTasks";
import {useAuth} from "../../auth/auth";
import {getLastDayOfWeek} from "../../utils/dates";

const emptyWeek = {
    sunday: {}, monday: {}, tuesday: {}, wednesday: {},
    thursday: {}, friday: {}, saturday: {}
}

const WeeklyTasks = () => {
    const currentWeekStart = getWeekStart();
    const {user} = useAuth();

    const [tasks, setTasks] = useState(emptyWeek);
    const [isLoading, setIsLoading] = useState(false);
    const [weekStart, setWeekStart] = useState(currentWeekStart);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setIsLoading(true);
                if (user) {
                    const tasksRef = doc(db, "weekly_tasks", user.uid, "tasks", weekStart);
                    const docSnap = await getDoc(tasksRef);
                    if (docSnap.exists()) {
                        setTasks(docSnap.data().tasks);
                    } else {
                        setTasks(emptyWeek)
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [user, weekStart]);

    const handleTaskChange = (day, task) => {
        setTasks(prevTasks => ({
            ...prevTasks,
            [day]: { ...prevTasks[day], [task]: !prevTasks[day][task] }
        }));
    };

    const saveTasks = async () => {
        try {
            setIsLoading(true);
            const userRef = doc(db, "weekly_tasks", user.uid);
            await setDoc(userRef, {
                email: user.email
            });

            const tasksRef = doc(db, "weekly_tasks", user.uid, "tasks", weekStart);
            await setDoc(tasksRef, {
                tasks // Save the tasks directly under the week start date document
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const goToPreviousWeek = () => {
        setWeekStart(prev => {
            const date = new Date(prev);
            date.setDate(date.getDate() - 7); // Move back by 7 days
            return date.toISOString().slice(0, 10);
        });
    };

    const goToNextWeek = () => {
        setWeekStart(prev => {
            const date = new Date(prev);
            date.setDate(date.getDate() + 7); // Move forward by 7 days
            return date.toISOString().slice(0, 10);
        });
    };

    const goToCurrentWeek = () => {
        setWeekStart(currentWeekStart);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Tasks for the week starting {weekStart} - {getLastDayOfWeek(weekStart)}
            </Typography>
            <ButtonGroup variant="contained" sx={{marginBottom:2}}>
                <Button onClick={goToPreviousWeek} disabled={isLoading}>Previous Week</Button>
                <Button onClick={goToCurrentWeek} disabled={isLoading || currentWeekStart ===weekStart}>Current Week</Button>
                <Button onClick={goToNextWeek} disabled={isLoading}>Next Week</Button>
            </ButtonGroup>
            <WeeklyTasksTable
                loading={isLoading}
                tasksValue={tasks}
                onTaskChange={handleTaskChange}
            />
            <LoadingButton variant="contained" loading={isLoading} color="primary" onClick={saveTasks} style={{ marginTop: '20px' }}>
                Save
            </LoadingButton>
        </Container>
    );
};

function getWeekStart() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = today.getDate() - dayOfWeek; // Subtract the day of the week
    const weekStartDate = new Date(today.setDate(diff));
    return weekStartDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD
}

export default WeeklyTasks;
