import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { fetchEmployeeList, deleteEmployee } from '../EmployeeReducer';

const Home = () => {
    const dispatch = useDispatch();
    const { employees, status, error } = useSelector((state) => state.employee);
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchEmployeeList());
        };

        fetchData();

    }, [dispatch, location.key]); 

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            dispatch(deleteEmployee(id));
        }
    };

    return (
        <div>
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
            <div style={{ justifyContent: "center", padding: "20px" }}>
                <TableContainer component={Paper}>
                    <Table style={{ border: "2px dashed purple", borderCollapse: "collapse" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Id</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Full Name</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Phone</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Image</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Age</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Salary</TableCell>
                                <TableCell style={{ fontWeight: "bold" }} align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.length > 0 ? (
                                employees.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>{employee.id}</TableCell>
                                        <TableCell>{employee.fullName}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>{employee.phone.slice(0, 10)}</TableCell>
                                        <TableCell>
                                            <img
                                                src={employee.image}
                                                alt={employee.fullName}
                                                style={{ width: '50px', height: '35px' }}
                                            />
                                        </TableCell>
                                        <TableCell>{employee.age}</TableCell>
                                        <TableCell>{employee.salary}</TableCell>
                                        <TableCell style={{justifyContent: 'space-between', alignItems: 'center', whiteSpace: 'nowrap' }}>
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
            </div>
        </div>
    );
};

export default Home;
