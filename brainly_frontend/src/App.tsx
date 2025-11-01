import { BrowserRouter, Routes, Route } from 'react-router-dom'


// import DashBoard from './pages/DashBoard'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Sign'
import DashBoard from './pages/DashBoard'
function App() {
  

  return (
   <BrowserRouter>
   
   <Routes>

    <Route path='/signup' element={<Signup/>}/>
    <Route path='/signin' element={<Signin/>}/>
    <Route path='/dashboard' element={<DashBoard/>}/>
   </Routes>
   
   </BrowserRouter>

  )
}

export default App
