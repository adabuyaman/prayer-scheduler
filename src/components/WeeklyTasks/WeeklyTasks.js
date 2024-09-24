import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Paper,
} from '@mui/material';
import { TASKS } from "../../dictionaries/tasks";

const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const WeeklyTasksTable = ({loading, tasksValue, tasks, onTaskChange, }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Day</TableCell>
                        {tasks.map((task, index) => (
                            <TableCell key={index}>{task}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {daysOfWeek.map(day => (
                        <TableRow key={day}>
                            <TableCell>{day.charAt(0).toUpperCase() + day.slice(1)}</TableCell>
                            {TASKS.map((task, index) => (
                                <TableCell key={index}>
                                    <Checkbox
                                        checked={tasksValue[day]?.[task] || false}
                                        disabled={loading}
                                        onChange={() => onTaskChange(day, task)}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

WeeklyTasksTable.defaultProps = {
    loading: false,
    tasksValue: {},
    onTaskChange: () => {},
    tasks: TASKS
}

export default WeeklyTasksTable;