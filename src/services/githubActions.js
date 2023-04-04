import { doc, setDoc,increment } from "firebase/firestore"; 
import { db,auth } from "../firebase";



export const addUser = async () => {
    const user = auth.currentUser;
    console.log(user)
    const makeData = await setDoc(doc(db,"users",user.email),{
        email:user.email,
        name:user.displayName,
        reputation:0
    },{merge:true})
    console.log("added User")
}



export const addRepo = async (repoName,templateId,callbackId) => {
    const dummy = (i) => {return i}
    const user = auth.currentUser;
    const repo_data = await fetch("https://api.github.com/repos/"+repoName)
    
    const data = await repo_data.json()
    console.log(data,repo_data.languages_url)
    const languages = await fetch(data.languages_url)
    console.log(languages)
    const lang_data = await languages.json()
    console.log(repo_data.body)
    console.log(user,data,lang_data)
    console.log(Object.keys(lang_data))
    var j = {} 
    Object.keys(lang_data).map(key =>{
        j[key] = increment(lang_data[key])})
    console.log(j)
    const makeData = await setDoc(doc(db,"users",user.email),{
        language:{...j}
    },{merge:true})
    
    const repoData = await setDoc(doc(db, "users", user.email,"repo",data.name), {
        lang_data,"forkCount":data.forks_count,status:"pending",templateId,callbackId,url:"https://github.com/"+repoName
      });
      console.log("added repo")
}


