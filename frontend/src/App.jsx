import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';

const routes = (
  <Router>
    <Routes>
      <Route path = '/' exact element={<Login />} />
      <Route path = '/signup' exact element={<Register />} />
      <Route path = '/dashboard' exact element={<Dashboard />} />
    </Routes>
  </Router>
)

const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App