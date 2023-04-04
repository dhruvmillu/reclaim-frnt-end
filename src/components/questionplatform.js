import React, { useState, useEffect } from "react";
import { TextField, Modal, Button, IconButton } from "@mui/material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NavBar from "./navbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import CloseIcon from '@mui/icons-material/Close';
import {
  addQuestion,
  getQuestions,
  addAnswer,
} from "../services/questionStack";

const QuestionPlatform = () => {
  const [open, setOpen] = React.useState(false);
  const [tags, setTags] = React.useState([]);
  const [ntag, setNTag] = React.useState([]);
  const [stag,setSTag] = React.useState([]);
  const [stagInp,setInp] = React.useState('');
  const [userId, setUserId] = React.useState();
  const [qry, setQry] = React.useState();
  const [data, setData] = React.useState(null);
  const [answer, setPAnswer] = React.useState({});
  const [ans, setAns] = React.useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClickShowPassword = () => {
    setSTag([...stag,stagInp])
    setInp('')
    const getUser = async () => {
        var { datares, answers } = await getQuestions(userId, [...stag,stagInp]);
        setData(datares);
        setAns(answers);
      };
    getUser();

};

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      const getUser = async () => {
        var { datares, answers } = await getQuestions(user.email, stag);
        setData(datares);
        setAns(answers);
      };
      if (user) {
        setUserId(user.email);
        getUser();
      }
    });
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleSubmit = () => {
    addQuestion(userId, { tags, qry });
    console.log("submitted");

    const getUser = async () => {
        var { datares, answers } = await getQuestions(userId, []);
        setData(datares);
        setAns(answers);
      };
      getUser();
    handleClose();

  };

  const getFilteredData = (tag) => {



    const getUser = async () => {
      var { datares, answers } = await getQuestions(userId, stag.filter((item)=>item!==tag));
      setData(datares);
      setAns(answers);
    };
    getUser();
  }

  const setAnswer = (i, id) => {
    console.log(i, id, answer[i]);
    addAnswer(userId, id, answer[i]);
    const getUser = async () => {
        var { datares, answers } = await getQuestions(userId, []);
        setData(datares);
        setAns(answers);
      };
      getUser();
    var k = {};
    k[i] = "";
    setPAnswer({ ...answer, ...k });
  };

  return (
    <div className=" h-screen">
      <NavBar />
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="bg-white absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] rounded-[10px] ">
            <div className="bg-white p-[30px] rounded-[10px]">
              <TextField
                id="outlined-multiline-static"
                label="Write your Question"
                multiline
                rows={4}
                onChange={(e) => {
                  setQry(e.target.value);
                }}
                className="w-[500px]"
                defaultValue="Default Value"
              />

              <div className="mt-[20px]">
                <div className="flex flex-wrap mb-[10px] max-w-[500px]">
                  {tags.length > 0 &&
                    tags.map((tag, i) => (
                      <div
                        key={i}
                        className="flex m-[3px] border-[1px] p-[5px] bg-[#00FFFF0F] text-cyan-500 rounded-full border-cyan-500 items-center"
                      >
                        {tag}
                      </div>
                    ))}
                </div>
                <div className="flex item-center">
                  <TextField
                    id="outlined-multiline-static"
                    label="Add tags"
                    defaultValue="Default Value"
                    onChange={(e) => {
                      setNTag(e.target.value);
                    }}
                  />
                  <IconButton onClick={() => setTags([...tags, ntag])}>
                    <AddCircleIcon />
                  </IconButton>
                </div>
              </div>
              <div className="w-full flex justify-center mt-[20px]">
                <Button
                  variant="contained"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      <div className="p-[20px]">
        
      {stag.length > 0 &&
                    stag.map((tag, i) => (
                      <div
                        key={i}
                        className="flex m-[3px] border-[1px] p-[5px] bg-[#00FFFF0F] w-fit text-cyan-500 rounded-full border-cyan-500 items-center"
                      >
                        {tag}
                        <IconButton onClick={()=>{
                            
                            setSTag(stag.filter((item)=>item!==tag))
                            getFilteredData(tag)
                            }}><CloseIcon/></IconButton>
                      </div>
                    ))}
      <FormControl sx={{ m: 1, width: '25ch' }} fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Add Tags</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            onChange={(e)=> setInp(e.target.value)}
            type='text'
            value={stagInp}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  <AddCircleIcon/>
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        {data &&
          data.map((item, i) => (
            <div className=" border-[1px] p-[20px] rounded-[10px] shadow-md my-[20px]">
              <div>
                <span className="font-bold">Author </span>
                {item.data.author}
              </div>
              <div className="text-[25px] mt-[10px]">
                <span className="font-bold">Q </span>
                {item.data.qry}
              </div>

              <div>
                <span className="font-bold">Tags </span>
                {item.data.tags.map((tag, i) => (
                  <div className="inline-block m-[3px] border-[1px] p-[5px] bg-[#00FFFF0F] text-cyan-500 rounded-full border-cyan-500 items-center">
                    {tag}
                  </div>
                ))}
              </div>
              <div className="mt-[20px] ">
                <p className="font-bold text-[25px]">Answers </p>
                <div>
                  {ans[item.id] &&
                    ans[item.id].map((ans, i) => (
                      <div className="relative border-[1px] p-[10px] rounded-[10px] shadow-md my-[10px] flex items-start w-[100%] ">
                        <div className="mr-[20px]">
                          <div>
                            <button>
                              <ArrowDropUpIcon fontSize="large" />
                            </button>
                            {ans.data.upvote}
                          </div>
                          <div>
                            <button>
                              <ArrowDropDownIcon fontSize="large" />
                            </button>
                            {ans.data.downvote}
                          </div>
                        </div>
                        <div className="mt-[5px] w-[90%]">
                          <div>
                            <span className="font-bold">Author </span>
                            {ans.data.author}
                          </div>
                          {console.log(ans)}
                          <div className="mt-[10px] w-full">
                            <TextField
                              id="outlined-multiline-static"
                              label="Add tags"
                              className="w-full"
                              defaultValue={ans.data.data}
                              disabled={true}
                            />{" "}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="mt-[20px]">
                  <TextField
                    id="outlined-multiline-static"
                    label="Write your Answer"
                    multiline
                    rows={4}
                    value={answer[i]}
                    onChange={(e) => {
                      var k = {};
                      k[i] = e.target.value;
                      setPAnswer({ ...answer, ...k });
                    }}
                    className="w-full"
                    placeholder="Default Value"
                  />
                  <div className="mt-[10px]">
                    <Button
                      variant="contained"
                      onClick={() => setAnswer(i, item.id)}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="w-fit sticky left-[90%] bottom-[16px]">
        <SpeedDial ariaLabel="SpeedDial basic example" icon={<SpeedDialIcon />}>
          <SpeedDialAction
            key={"add new repo"}
            icon={<AddCircleIcon />}
            tooltipTitle={"add new repo"}
            onClick={() => handleOpen()}
          />
        </SpeedDial>
      </div>
    </div>
  );
};

export default QuestionPlatform;
