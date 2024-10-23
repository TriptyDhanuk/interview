import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux"; 
import { addEmployee } from "../EmployeeReducer";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

export default function Create() {
  const dispatch = useDispatch(); 
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    image: "",
    age: "",
    salary: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For phone input, limit to 10 digits
    if (name === "phone") {
      // Allow only digits and restrict length to 10
      if (/^\d{0,10}$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://interviewtesting.onrender.com/v1/users/employee/create', formData);
      console.log('Response:', response.data);

      dispatch(addEmployee(response.data));
      setOpenSnackbar(true); 
      
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        image: "",
        age: "",
        salary: "",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); 
  };

  return (
    <Paper style={{ padding: 20 }}>
      <h2 style={{
          textAlign: 'left',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'green',
          margin: '20px 0',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
          letterSpacing: '1px'
      }}>
        ADD EMPLOYEE
      </h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 10 }} // Limit input length to 10
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" style={{ backgroundColor: "green" }} type="submit">
              Submit
            </Button>
           
          </Grid>
          
        </Grid>
      </form>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Employee successfully submitted!
        </Alert>
      </Snackbar>
    </Paper>
  );
}
