
import { db } from "@/main"

function sendToDatabase(data, payload) {

data && Object.keys(data).forEach(key => {
    const nestedContent = data[key]
            db.collection(payload)
                .add(nestedContent)
                .catch((error) => {
                    console.error("Error writing document: ", error)
                })
        })
    }

export default sendToDatabase