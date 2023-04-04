import { makeClaim } from '../services/reclaim';
import githubSignIn from '../services/gituhubSignIn';
import { TextField } from '@mui/material';
import QRCode  from 'qrcode';
import { useState} from "react"

function Embedded({reponame}){

    const [repoName,setRepoName] = useState(reponame)
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
  
  
      <div className="bg-white absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] ">
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
         {console.log(reponame)}
          <TextField id="outlined-basic" value={repoName} onChange = {(evt) => setRepoName(evt.target.value)}  disabled={reponame?true:false}  helperText="format l (username/repo)" label="Repo name" variant="outlined" color="warning" />
          <button onClick={()=>putClaim()} className="bg-indigo-500 font text-violet-50 rounded p-[10px] m-[10px] ">Claim repo</button>
          
        </header>
  
        
  
      </div>
    );
  
  }

export default Embedded