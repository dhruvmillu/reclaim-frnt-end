import logo from './logo.svg';
import './App.css';
import { makeClaim,verifyClaim } from './services/reclaim';
import githubSignIn from './services/gituhubSignIn';
import { Route,Routes } from 'react-router-dom';
import { TextField } from '@mui/material';
import QRCode  from 'qrcode';
import { useState,useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import Profile from './components/profile';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import QuestionPlatform from './components/questionplatform';


function Embedded(){

  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) =>{
        if(user){
            navigate('/profile')
        }
        else{
            console.log("no user")
            navigate('/')
        }
    })
  },[])


  

  return (


    <div className="App">
      <header className="w-screen h-screen flex justify-center items-center text-[30px]">
      
        <button onClick ={()=> githubSignIn()} className="bg-indigo-500 font text-violet-50 rounded p-[10px] m-[10px] ">Github SignIn</button>
        
      </header>

      

    </div>
  );

}


function ExitScreen() {
  let x = useParams()
  const [d,setD] = useState(null)
    useEffect(() => {
      const checkClaim = async () =>{
        var y = await verifyClaim(x.id)
        console.log(y)
        setD(y)
      }
      console.log(x.id)
      checkClaim()
    }, [])
    
    return (
      <div className="App">
      <header className="App-header">
        {d=="okay"?"You can close this window, the repo is claimed":"Please wait do not close this window"}
        </header>
        </div>
    )

}



function App() {
  return (

    <Routes>
      <Route path="/" element={<Embedded/>} />
      <Route path="/callback/:id" element={<ExitScreen/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/QueryDesk" element={<QuestionPlatform/>} />
    </Routes>

  );
}

export default App;
