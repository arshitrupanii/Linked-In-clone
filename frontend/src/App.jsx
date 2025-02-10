import './App.css'
import { Route, Routes, BrowserRouter } from "react-router-dom"
import Layout from "./components/Layout/Layout"


import Homepage from "./Pages/Homepage.jsx"
import Loginpage from "./pages/auth/Loginpage.jsx"
import SignPage from "./pages/auth/SignPage.jsx"

function App() {

  return (
    <Layout>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/signup" element={<SignPage />} />
        </Routes>

      </BrowserRouter>


    </Layout>
  )
}

export default App