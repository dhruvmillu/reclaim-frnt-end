import { db } from "../firebase";
import { collection, getDocs ,getDoc,doc} from "firebase/firestore";


export const getUserData = async (email) => {
    console.log(email)
    const repoRef = await fetch("https://api.github.com/user/"+email+"/repos")
    const repos = await repoRef.json()
    const res = repos.map(repo => { return {name:repo.name,full_name:repo.full_name, forks:repo.forks,url:repo.html_url}})
    return res
}

export const getClaimData = async (email) => {
    const data = await getDocs(collection(db, "users", email,"repo"));
    const res = data.docs.map(doc => {return {id:doc.id,data:doc.data()}})
    return res
}

export const getUser = async (email) => {
    const data = await getDoc(doc(db, "users", email));
    return data.data()
}