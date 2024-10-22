import React, { useEffect, useState } from 'react';
import { fetchEmployeeList } from '../EmployeeReducer';
import { Container, Typography, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadEmployees = async () => {
            setLoading(true);
            try {
                const data = await fetchEmployeeList();
                setEmployees(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadEmployees();
    }, []); 

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error: {error}</Alert>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center">Employee List</Typography>
            <List>
                {employees.map(employee => (
                    <ListItem key={employee.id}>
                        <ListItemText primary={employee.fullName} secondary={employee.email} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default EmployeeList;
