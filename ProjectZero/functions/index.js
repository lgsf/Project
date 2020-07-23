var functions = require('firebase-functions')
var admin = require('firebase-admin')

admin.initializeApp({
    databaseURL: 'https://projectzero-9bff2.firebaseio.com'
})

 exports.saveUsers = functions.https.onCall((data) => {
    data && Object.keys(data).forEach(key => {
        const nestedContent = data[key]
        admin.auth().createUser({
            email: nestedContent.email,
            password: 'temporario'
            }).then(userRecord => {
                return admin.firestore().collection('users')
                .doc(userRecord.uid)
                .set({
                    name: nestedContent.name,
                    email: nestedContent.email,
                    phone: nestedContent.phone || '',
                    birth_date: nestedContent.birth_date || '',
                    group: ''
                })
              }).catch(err => {
                    throw new functions.https.HttpsError(err)
              })
        })
})

exports.saveUser = functions.https.onCall(async (state) => {
    try {
        const userRecord = await admin.auth().createUser({
            email: state.editUserEmail,
            password: 'temporario'
        })
        return admin.firestore().collection('users')
            .doc(userRecord.uid)
            .set({
                name: state.editUserName,
                email: state.editUserEmail,
                phone: state.editUserPhone,
                birth_date: state.editUserBirthDate,
                group: state.editUserGroup
            })
    }
    catch (err) {
        throw new functions.https.HttpsError(err)
    }
})
