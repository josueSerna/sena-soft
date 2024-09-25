import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from "./layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RentPage from './pages/RentPage';



function App() {
  return (

      <Router>
        <Routes>
          <Route path="/" element={ <RegisterPage/> }/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/rent/:id" element={<RentPage />} />

          <Route path="/map" element={<MainLayout/>}>
          </Route>
        </Routes>
      </Router>
  
  );
}

export default App;