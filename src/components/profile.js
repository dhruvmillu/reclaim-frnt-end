import { useState, useEffect } from "react";

import * as React from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import { getUserData, getClaimData, getUser } from "../services/userData";
import { async } from "@firebase/util";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Embedded from "./embedded";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import AddCircleIcon from "@mui/icons-material/AddCircle";
function Profile() {
  const [user, setUser] = useState(null);
  const [userD, setUserd] = useState(null);
  const [data, setData] = useState(null);
  const [claimData, setClaimData] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [lang,setLang] = React.useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [{ icon: <AddCircleIcon />, name: "Add another repo" }];

  const claimRepo = (repoName) => {
    console.log(repoName);
    setSelectedRepo(repoName);
    handleOpen();
  };
  const findClaim = (item) => {
    if (claimData) {
      const s = claimData.find((elem) => {
        return elem.id === item.name;
      });
      return s;
    }
  };

  const getuser = async (email) => {
    const d = await getUser(email)
    console.log(d.language)
    setLang(d.language)
    setUserd(d)
}

  const pullData = async (user) => {
    console.log(user.providerData[0].uid        )
    setData(await getUserData(user.providerData[0].uid));
    setClaimData(await getClaimData(user.email));
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        
        if(user){
      setUser(user);
      pullData(user);
      getuser(user.email)
      
    }
    });

    console.log("user", user);
  }, []);


  useEffect(() => {
    console.log(lang)
  },[lang]);


  return (
    <div className="w-full">
      <NavBar />
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Embedded reponame={selectedRepo} />
        </Modal>
      </div>
      <div className="flex justify-center mt-[40px]">
        <div className="m-[30px] p-[10px] rounded-[10px] min-w-[500px] text-[20px] text-white h-fit bg-indigo-500">
            <div  className="mt-[20px]">
                <span className="font-bold">Name: </span>{userD && userD?.name}
            </div>
            <div  className="mt-[20px]">
                <span className="font-bold">Email: </span>{userD?.email}

            </div>
            <div  className="mt-[20px]">
                <span className="font-bold">Language Score: </span>
                <div className="ml-[20px]">
                    {console.log(userD)}
                    {lang && Object.keys(lang).map((item,i) => (
                        <div key={i}>
                            <span className="font-semibold">{item}: </span>
                            <span>{userD?.language[item]}</span>
                            </div>))}
                </div>

            </div>
        </div>
      
      <div className="max-w-fit h-screen grid grid-cols-3 auto-rows-min">
        {data &&
          data.map((item, i) => (claimData && (findClaim(item)?.data.status === "verified" || findClaim(item)?.data.status === "pending") ? (null) : (
                  
            
            <div
              key={i}
              className=" bg-indigo-500 duration-500 border-[1px] m-[10px] p-[10px] rounded-[10px] shadow-lg text-[20px] h-fit  text-white flex justify-between items-center "
            >
              <div>
                <p className="font-bold">{item.full_name}</p>
                <p className="text-[15px]">forks: {item.forks}</p>
                <a href={item.url} className="text-[15px]" target="_blank">
                  Visit Repository
                </a>
              </div>
              <div className="h-full bg-white p-[10px] rounded-[5px] ml-[100px]">
              <button
                    className="text-black font-bold hover:text-gray-500"
                    onClick={() => claimRepo(item.full_name)}
                  >
                    Claim
                  </button>
                
                
              </div>
            </div>)
          ))}
          {claimData &&
          claimData.map((item, i) => ((
            <div 
              key={i}
              className=" bg-indigo-500 duration-500 border-[1px] m-[10px] p-[10px] h-fit rounded-[10px] shadow-lg text-[20px]  text-white flex justify-between items-center "
            >
              <div>
                <p className="font-bold">{item.id}</p>
                <p className="text-[15px]">forks: {item.data.forkCount}</p>
                <a href={item.data.url} className="text-[15px]" target="_blank">
                  Visit Repository
                </a>
              </div>
              <div className="h-full bg-white p-[10px] rounded-[5px] ml-[100px]">
                {claimData && item.data.status === "verified" ? (
                  <CheckCircleIcon
                    className="text-[100px]"
                    color="primary"
                    fontSize="large"
                  />
                ) : (
                  <AccessTimeFilledIcon fontSize="large" color="warning" />
                ) }
                
              </div>
            </div>
                )))}
      </div>
      </div>
      <div className="w-fit sticky left-[95%] bottom-[16px]">
        <SpeedDial ariaLabel="SpeedDial basic example" icon={<SpeedDialIcon />}>
          <SpeedDialAction
            key={"add new repo"}
            icon={<AddCircleIcon />}
            tooltipTitle={"add new repo"}
            onClick={() => claimRepo(null)}
          />
        </SpeedDial>
      </div>
    </div>
  );
}
export default Profile;
