import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
    employees: [],
    status: 'idle', 
    error: null,
};


export const fetchEmployeeList = createAsyncThunk(
    'employee/fetchEmployeeList',
    async () => {
        const response = await axios.get('https://interviewtesting.onrender.com/v1/users/employee/list');
        
        return response.data.data; 
    }
);


export const deleteEmployee = createAsyncThunk(
    'employee/deleteEmployee',
    async (id) => {
        await axios.delete(`https://interviewtesting.onrender.com/v1/users/employee-remove/${id}`);
        return id;
    }
);

const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {
        addEmployee: (state, action) => {
            state.employees.push(action.payload);
        },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployeeList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEmployeeList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                
                if (Array.isArray(action.payload)) {
                    state.employees = action.payload.map(employee => ({
                        id: employee._id, 
                        fullName: employee.fullName,
                        email: employee.email,
                        phone: employee.phone,
                        image: employee.image,
                        age: employee.age,
                        salary: employee.salary,
                    }));
                } else {
                    console.error("Fetched data is not an array:", action.payload);
                    state.employees = []; 
                }
            })
            .addCase(fetchEmployeeList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                
                state.employees = state.employees.filter(employee => employee.id !== action.payload);
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                
                console.error('Delete failed:', action.error.message);
            });
    },
});


export const { addEmployee } = employeeSlice.actions; 

export default employeeSlice.reducer;
