var functions = require('firebase-functions');
var admin = require('firebase-admin');

admin.initializeApp({
})

const db = admin.firestore()
const auth = admin.auth()

 exports.importUsers = functions.https.onCall((data) => {
    data && Object.keys(data).forEach(key => {
        let nestedContent = data[key]
        auth.createUser({
            email: nestedContent.email,
            password: 'temporario'
            }).then(userRecord => {
                return db.collection('users')
                .doc(userRecord.uid)
                .set({
                    name: nestedContent.name || '',
                    email: nestedContent.email || '',
                    phone: nestedContent.phone || '',
                    birth_date: nestedContent.birth_date || '',
                    group: '',
                    group_id: ''
                })
              }).catch(err => {
                    throw new functions.https.HttpsError(err)
              })
        })
})

exports.saveUser = functions.https.onCall(async (state) => {
    try {
        const record = await auth.createUser({
            email: state.editUserEmail,
            password: 'temporario'
        })
        return db.collection('users')
            .doc(record.uid)
            .set({
                name: state.editUserName,
                email: state.editUserEmail,
                phone: state.editUserPhone,
                birth_date: state.editUserBirthDate,
                group: state.editUserGroup,
                group_id: state.editUserGroup.id
            })
    }
    catch (err) {
        throw new functions.https.HttpsError(err)
    }
})
