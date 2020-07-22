
import { db } from "@/main"

function sendToDatabase(data) {
    data && Object.keys(data).forEach(key => {
        const nestedContent = data[key]
                db.collection("clients")
                    .add(nestedContent)
                    .catch((error) => {
                        console.error("Error writing document: ", error)
                    })
            })
}

export default sendToDatabase