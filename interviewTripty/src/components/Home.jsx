import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEmployeeList, deleteEmployee } from '../EmployeeReducer';

const Home = () => {
    const dispatch = useDispatch();
    const { employees, status, error } = useSelector((state) => state.employee);

    useEffect(() => {

        dispatch(fetchEmployeeList());
    }, [dispatch]); 

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            dispatch(deleteEmployee(id));
        }
    };

    const truncate = (str, maxLength) => {
        if (str.length > maxLength) {
            return str.slice(0, maxLength) + '...';
        }
        return str;
    };
    

    return (
        <>
            <h2 style={{
                textAlign: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'rgb(149 43 163)',
                margin: '20px 0',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                letterSpacing: '1px'
            }}>
                Employee's Table
            </h2>

            <Link to="/create">
                <Button style={{ backgroundColor: "green", color: "white", marginLeft: "45%" }}>
                    Add Employee +
                </Button>
            </Link>
            <br /><br />
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p>Error: {error}</p>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Salary</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.length > 0 ? (
                            employees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>{employee.id}</TableCell>
                                    <TableCell>{employee.fullName}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.phone}</TableCell>
                                    <TableCell>
                                    <a href={employee.image} target="_blank" rel="noopener noreferrer">
                                            {truncate(employee.image, 20)} 
                                        </a>
                                       <br></br>
                                        <img src={employee.image} alt={employee.fullName} style={{ width: '50px', height: '50px' }} />
                                    </TableCell>
                                    <TableCell>{employee.age}</TableCell>
                                    <TableCell>{employee.salary}</TableCell>
                                    <TableCell align="right">
                                        <Link to={`/update/${employee.id}`}>
                                            <Button variant="contained" color="primary" size="small">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button 
                                            onClick={() => handleDelete(employee.id)} 
                                            variant="contained" 
                                            color="secondary" 
                                            size="small" 
                                            style={{ marginLeft: 10 }}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">No employees found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default Home;
