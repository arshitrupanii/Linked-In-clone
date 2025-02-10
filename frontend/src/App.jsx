import './App.css'
import Layout from "./components/Layout/Layout.jsx"
import {Route, Routes } from "react-router-dom"
import Homepage from "./Pages/auth/Homepage.jsx"
import Loginpage from "./pages/auth/Loginpage.jsx"
import SignPage from "./pages/auth/SignPage.jsx"

function App() {

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<div><Homepage /> </div>} />
        <Route path="/login" element={<div><Loginpage /> </div>} />
        <Route path="/singup" element={<div><SignPage /> </div>} />
      </Routes>
    </Layout>


  )
}

export default App
