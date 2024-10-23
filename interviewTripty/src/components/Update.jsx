import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    TextField,
    Button,
    Container,
    Snackbar,
    Alert,
    Box,
    CircularProgress as Loader,
} from '@mui/material';

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlytzaibn/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "l5w5rytn"; 

const Update = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        salary: '',
        image: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

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

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const uploadImage = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        
        try {
            const response = await axios.post(CLOUDINARY_URL, formData);
            setUploading(false);
            return response.data.secure_url;
        } catch (err) {
            setUploading(false);
            setUploadError("Image upload failed. Please try again.");
            throw err;
        }
    };

    const handleUpdate = async () => {
        try {
            let imageUrl = formData.image;
            if (typeof imageUrl === 'object') {
                imageUrl = await uploadImage(formData.image);
            }

            const response = await axios.put(`https://interviewtesting.onrender.com/v1/users/employee-update/${id}`, {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                age: formData.age,
                salary: Number(formData.salary),
                image: imageUrl,
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

    if (loading) return <Loader />;
    if (error) return <Alert severity="error">Error: {error}</Alert>;

    return (
        <Container maxWidth="sm">
            <h2 style={{
                textAlign: 'left',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#3ba7f2',
                margin: '20px 0',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                letterSpacing: '1px'
            }}>
                UPDATE EMPLOYEE
            </h2>
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
                <div style={{
                    marginTop: '16px',
                    border: '1px solid grey',
                    borderRadius: '4px',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <label htmlFor="image-upload" style={{ color: "grey", marginRight: '20px', fontWeight: 'bold' }}>
                        Upload Your Image:
                    </label>
                    <input
                        style={{ display: "none" }}
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <Button
                        variant="contained"
                        component="span"
                        style={{ backgroundColor: "#040404", color: "white", marginRight: '10px' }}
                        onClick={() => document.getElementById('image-upload').click()}
                    >
                        Upload Image
                    </Button>
                    {formData.image && <span>{formData.image.name}</span>}
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={uploading}
                >
                    {uploading ? <Loader size={24} color="inherit" /> : "Update"}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/')}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Go Back
                </Button>
            </Box>

            <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success">
                    Employee updated successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={!!uploadError} autoHideDuration={6000} onClose={() => setUploadError(null)}>
                <Alert onClose={() => setUploadError(null)} severity="error">
                    {uploadError}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Update;
