import { Outlet } from 'react-router-dom'
import MapComponent from '../components/MapComponent'
import NavBar from '../components/Navbar'

const MainLayout = () => {
  return (
    <>
    <NavBar/>
    <MapComponent/>
    </>
  
  )
}

export default MainLayout
