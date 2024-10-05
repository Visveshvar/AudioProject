import {useState,useEffect} from 'react'
import axios from 'axios'
import { BrowserRouter,Route,Routes,Navigate } from 'react-router-dom';
import LogIn from './components/LogIn';
import User from './components/Userpage';
import HomeContent from './components/Homecontent';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './components/SignUp';
import { useAuth } from './components/AuthContext';
import Navbar from './components/Navbar';
import './CSS/Navbar.css'
import Industry from './components/Industry';
import Dashboard from './components/Dashboard';
import Notification from './components/Notification';
import Profile from './components/Profile';
import { WebsocketProvider } from './components/WebContext';
function App() {
  // const [data,setData]=useState([])
  // useEffect(()=>{
  //   axios.get("http://localhost:5000/").then(response=>{
  //     setData(response.data.members);
  //     console.log(response.data.members);
  //   })
  //   .catch(error=>{
  //     console.error("Error fetching the member data: ",error);
  //   });
  // },[])
  const {isAuthenticated}=useAuth()
  return (
    <div >
      <BrowserRouter>
          <Routes>
              <Route path='/signup' element={<SignUp/>}></Route>
              <Route path='/login' element={<LogIn/>}></Route>
              <Route path='/' element={<User/>}></Route>
              <Route path='/home' element={<Navbar/>}>
                <Route index element={ <HomeContent />}/>
                <Route path='industry' element={<Industry/>}/>
                <Route path='dashboard' element={<Dashboard/>}/>
                <Route path='notification' element={<Notification/>}/>
                <Route path='profile' element={<Profile/>}/>
              </Route>
              
          </Routes>
        </BrowserRouter>
        
    </div>
  );
}

export default App;
