import { db } from "@/main";
import { auth } from "@/main";

const state = () => ({
    search: "",
    showEditModal: false,
    selected: [],
    userList: [],
    userGroups: []
});

const mutations = {
    setUserGroups(state, payload) {
        state.userGroups = payload
    },

    setUserList(state, payload) {
        state.userList = payload
    },

    setSelectedUser(state, payload) {
        state.selected = payload
    },

    setShowEditModal(state, payload) {
        state.showEditModal = payload
    },

    setName(state, payload) {
        state.selected.name = payload
    },

    setEmail(state, payload) {
        state.selected.email = payload
    },

    setPhone(state, payload) {
        state.selected.phone = payload
    },

    setBirthDate(state, payload) {
        state.selected.birth_date = payload
    },

};

const actions = {
    readGroups({ commit }) { //Move to groups module
        db.collection("groups")
            .get()
            .then(querySnapshot => {
                let userGroups = []
                querySnapshot.forEach(doc => {
                    userGroups.push({
                        name: doc.data().name,
                        id: doc.id
                    });
                });
                commit('setUserGroups', userGroups)
            })
            .catch(error => {
                console.log("Error getting documents: ", error);
            });
    },

    readUsers({ state, commit }) {
        db.collection("users")
            .get()
            .then(function (snapshots) {
                onUsersLoaded({ state, commit }, snapshots)
            })
            .catch(error => {
                console.log("Error getting documents: ", error);
            });
    },

    onSelectedUser({ commit }, payload) {
        var selected = !payload ? undefined : payload[0];
        commit('setSelectedUser', selected)
    },

    openEditUserModal({ state, commit }) {
        if (!state.selected)
            commit('setSelectedUser', { name: '', email: '', phone: '', birth_date: formatDate(new Date().toISOString().substr(0, 10)), group: { name: '', id: '' } })
        commit('setShowEditModal', true)
    },

    setName({ commit }, payload) {
        commit('setName', payload)
    },

    setEmail({ commit }, payload) {
        commit('setEmail', payload)
    },

    setPhone({ commit }, payload) {
        commit('setPhone', payload)
    },

    setBirthDate({ commit }, payload) {
        commit('setBirthDate', payload)
    },

    closeEditUserModal({ commit }) {
        commit('setShowEditModal', false)
    },

    save({ state, commit, dispatch }) {
        if (state.selected.id)
            updateUser({ state, commit }, state.selected)
        else
            createUser({ state, commit }, state.selected)

        dispatch('users/readUsers')
    }

};

function onUsersLoaded(context, payload) {
    let users = [];
    payload.forEach(userSnapShot => {
        let userData = userSnapShot.data();
        userData.id = userSnapShot.id;
        userData.group = [context.state.userGroups.find(group => group.id == userSnapShot.data().group_id)]
        users.push(userData);
    });
    context.commit('setUserList', users);
}

function createUser(context, payload) { //Create auth module and move the create user in firebase
    auth
        .createUserWithEmailAndPassword(this.email, "temporario")
        .then(function (userRecord) {
            let uid = userRecord.user.uid
            return new Promise(function (resolve) {
                resolve(uid);
            });
        })
        .then(function (uid) {
            db.collection("users")
                .doc(uid)
                .set({
                    name: payload.name,
                    email: payload.email,
                    phone: payload.phone,
                    birth_date: payload.birth_date,
                    group_id: self.group
                });
        })
        .then(() => {
            context.commit('closeEditUserModal')
        })
        .catch(error => {
            console.error("Error inserting document: ", error);
        });

    this.$store.dispatch("userSignUp", {
        email: this.email,
        password: "temporario"
    });
}

function updateUser(context, payload) {
    db.collection("users")
        .doc(context.selected.id)
        .update({
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            birth_date: payload.birthDate,
            group_id: payload.group_id
        })
        .then(() => {
            this.close();
        })
        .catch(error => {
            console.error("Error updating document: ", error);
        });
}

function formatDate(date) {
    if (!date) return null;

    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
