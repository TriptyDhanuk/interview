import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux"; 
import { addEmployee } from "../EmployeeReducer";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlytzaibn/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "l5w5rytn"; 

export default function Create() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    image: null,
    age: "",
    salary: "",
  });
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else if (name === "phone") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else if (name === "age") {
      
      if (/^\d{0,2}$/.test(value)) {
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

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await axios.post(CLOUDINARY_URL, formData);
    return response.data.secure_url; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      let imageUrl = null;
      if (formData.image) {
        imageUrl = await uploadImage(formData.image); 
      }

      const dataToSend = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        salary: formData.salary,
        image: imageUrl, 
      };

      const response = await axios.post('https://interviewtesting.onrender.com/v1/users/employee/create', dataToSend);
      console.log('Response:', response.data);
      dispatch(addEmployee(response.data));
      setOpenSnackbar(true); 
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        image: null,
        age: "",
        salary: "",
      });
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false); 
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); 
  };

  const handleGoBack = () => {
    navigate("/"); 
    window.location.reload(); 
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
              inputProps={{ maxLength: 10 }} 
            />
          </Grid>
          <Grid item xs={12}>
            <div style={{
              border: '1px solid grey',
              borderRadius: '4px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              cursor: 'pointer',
            }}>
              <label htmlFor="image-upload" style={{
                color: "gray",
                marginRight: "20px",
                fontWeight: 'bold',
                display: 'block',
              }}>
                Upload Your Image:
              </label>
              
              <input
                style={{ display: "none" }}
                id="image-upload"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
              />
              
              <Button 
                variant="contained" 
                component="span" 
                style={{ backgroundColor: "#040404", color: "white", marginRight: '10px' }} 
                onClick={() => document.getElementById('image-upload').click()} 
              >
                Upload Image
              </Button>

              {formData.image && <span style={{ marginLeft: '10px' }}>{formData.image.name}</span>}
            </div>
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
            <Button variant="contained" style={{ backgroundColor: "green" }} type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
            </Button>
            <Button variant="outlined" style={{ marginLeft: '10px' }} onClick={handleGoBack}>
              Go Back
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
