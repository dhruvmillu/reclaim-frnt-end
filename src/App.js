import logo from './logo.svg';
import './App.css';
import { makeClaim,verifyClaim } from './services/reclaim';
import githubSignIn from './services/gituhubSignIn';
import { Route,Routes } from 'react-router-dom';
import { TextField } from '@mui/material';
import QRCode  from 'qrcode';
import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';



function Embedded(){

  const [repoName,setRepoName] = useState("")
  const [qr,setQr]= useState(null)
  const [appUrl,setAppUrl] = useState("")
  const [tid,setTID] = useState("")

  const putClaim = async () => {
     const {uri, callbackId } = await makeClaim(repoName)
     console.log(uri, callbackId)
     QRCode.toDataURL(uri, (err, url) => {
      setQr(url)
      setAppUrl(uri)
      setTID(callbackId)
    })
  }


  return (


    <div className="App">
      <header className="App-header">
      {qr &&
        <div>
          <div className='flex flex-col justify-center items-center'>
            <p>scan Image to open Reclaim Wallet</p>
            <img src={qr} className="h-80 w-80" />
          </div>
          <div className='flex flex-col justify-center'>
            <p>On Mobile app <a href={appUrl} className="text-indigo-500 hover:text-violet-900 duration-500 font-bold">click here</a> to open wallet </p>
          </div>
          <div className='flex flex-col justify-center'>
            <p><a className="text-indigo-500 hover:text-violet-900 duration-500 font-bold" href={"https://drive.google.com/file/d/1S2l2zT-5Um-W3bND69_6l_ubTZus9ryT/view?usp=drivesdk "}>click here</a> to download the app</p>
          </div>
          
        </div>
       }
        <button onClick ={()=> githubSignIn()} className="bg-indigo-500 font text-violet-50 rounded p-[10px] m-[10px] ">Github SignIn</button>
        <TextField id="outlined-basic" onChange = {(evt) => setRepoName(evt.target.value)}  helperText="format (username/repo)" label="Repo name" variant="outlined" color="warning" />
        <button disabled={repoName.length == 3} onClick={()=>putClaim()} className="bg-indigo-500 font text-violet-50 rounded p-[10px] m-[10px] ">Claim repo</button>
        
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
        {x.id}
        {d=="okay"?"You can close this window":"Please wait do not close this window"}
        </header>
        </div>
    )

}



function App() {
  return (

    <Routes>
      <Route path="/" element={<Embedded/>} />
      <Route path="/callback/:id" element={<ExitScreen/>} />
    </Routes>

  );
}

export default App;
