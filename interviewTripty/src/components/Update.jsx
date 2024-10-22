import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    TextField,
    Button,
    Container,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
    Box
} from '@mui/material';

const Update = () => {
    const { id } = useParams(); 
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        salary: '',
        image: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`https://interviewtesting.onrender.com/v1/users/employee/${id}`);
                const employeeData = response.data.data; 
                
                
                setFormData({
                    fullName: employeeData.fullName,
                    email: employeeData.email,
                    phone: employeeData.phone,
                    age: employeeData.age,
                    salary: employeeData.salary,
                    image: employeeData.image,
                });
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`https://interviewtesting.onrender.com/v1/users/employee-update/${id}`, {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                age: formData.age,
                salary: Number(formData.salary), 
                image: formData.image,
            });
            if (response.status === 200) {
                setSuccess(true); 
                setTimeout(() => {
                    navigate('/'); 
                }, 2000); 
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error: {error}</Alert>;

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom align="center">Update Employee</Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                <TextField
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Image URL"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Update
                </Button>
            </Box>

            <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success">
                    Employee updated successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Update;
