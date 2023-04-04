// callbackUrl is triggered when user submits the claim on Reclaim app

import { Reclaim, generateUuid } from '@reclaimprotocol/reclaim-sdk';
import { addRepo } from './githubActions';
import { auth,db } from '../firebase';
import { doc, updateDoc } from "firebase/firestore"; 
const callbackUrl = "https://stickandstack.web.app/" + '/callback/'
const reclaim = new Reclaim(callbackUrl)



export const makeClaim = async (repoName) => {
    const user = auth.currentUser;
    const connection = reclaim.connect(
        'Github-contributor',
        [
          {
            provider: 'github-contributor',
            params: {
                repo:repoName
            }
          }
        ]
      )

      const callbackId = repoName.split("/")[1]+"@"+user.email;
      const template = (await connection).generateTemplate(callbackId)
      
      const uri = template.url
        console.log(uri,callbackId)
      const templateId = template.id
      addRepo(repoName,templateId,callbackId)
      return { uri, callbackId }


}


export const verifyClaim = async (id) => {
    const data = id.split(/[@](.*)/)
    console.log(data)
    const docRef = updateDoc(doc(db, "users", data[1],"repo",data[0]), {
        status:"verified"
    })

    return "okay"

}