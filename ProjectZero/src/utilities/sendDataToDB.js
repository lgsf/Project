
import { db } from "@/main"


const patternEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const patternCnpj = /^[0-9]{2}[.][0-9]{3}[.][0-9]{3}[/]0001[-][0-9]{2}$/;

function sendToDatabase(data) {
    let userArray = []
    data && Object.keys(data).forEach(key => {
        const nestedContent = data[key]
        if (patternEmail.test(nestedContent.email) && patternCnpj.test(nestedContent.cnpj)) {
                db.collection("clients")
                    .add(nestedContent)
                    .catch((error) => {
                        console.error("Error writing document: ", error)
                    })
             }   
        else {
            userArray.push(nestedContent)
        }
    })
    return userArray
}

export default sendToDatabase