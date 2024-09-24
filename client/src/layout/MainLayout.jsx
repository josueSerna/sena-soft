import { Outlet } from 'react-router-dom'
import MapComponent from '../components/MapComponent'

const MainLayout = () => {
  return (
    <div>
        <h1>Mapa Sena</h1>
        <MapComponent/>
        <main>{<Outlet/>}</main>
    </div>
  )
}

export default MainLayout
