import { db } from "../firebase";
import { arrayUnion, getDocs,doc,collection, addDoc, updateDoc,query,where } from "firebase/firestore";

export const addQuestion = async (user, data) =>{
    const docRef = await addDoc(collection(db, "question" ), {
        ...data,author:user,
    })

    const updateRef = await updateDoc(doc(db, "users", user), {
        question:arrayUnion(docRef.id)
    })
}

export const getQuestions = async (user,tags) =>{
    var data
    console.log(tags)
    if(tags.length>0){
        data = await getDocs(query(collection(db, "question" ),where("tags","array-contains-any",tags)));
    } 
    else{
        data = await getDocs(collection(db, "question" ));

    }


    
    const  datares = data.docs.map(doc => {
        return {
        id:doc.id,data:doc.data(),
    }})

    var answers = {}
    for(var i in datares){
        answers[datares[i].id] = await getAnswers(datares[i].id)

    }
    var res = 0

    return {datares,answers}
}

export const addAnswer = async (user,questionId,data) =>{
    const docRef = await addDoc(collection(db, "question",questionId,"answer"), {
        data,author:user,upvote:0,downvote:0
    })

    const updateRef = await updateDoc(doc(db, "users", user), {
        answer:arrayUnion(docRef.id)
    })
}

export const getAnswers = async (questionId) =>{
    const data = await getDocs(collection(db, "question",questionId,"answer"));
    const res = data.docs.map(doc => {return {id:doc.id,data:doc.data()}})
    return res
}