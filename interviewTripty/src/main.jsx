
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Provider} from "react-redux"
import EmployeeReducer from "./EmployeeReducer.jsx"
import { configureStore } from '@reduxjs/toolkit'


const store=configureStore({
  reducer:{
  employee:EmployeeReducer
}
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
