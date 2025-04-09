import Footer from "./common/Footer"
import Navbar from "./common/Navbar"

import { Outlet } from "react-router-dom"

function App() {
 

  return (
    <>
      <Navbar/>
       <Outlet/>
      <Footer/>
    </>
  )
}

export default App
