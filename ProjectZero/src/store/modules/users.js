import { db } from "@/main";
import { auth } from "@/main";

const state = () => ({
    search: "",
    showEditModal: false,
    selected: [],
    editUserName: '',
    editUserEmail: '',
    editUserPhone: '',
    editUserBirthDate: formatDate(new Date().toISOString().substr(0, 10)),
    editUserGroup: '',
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
        state.editUserName = payload
    },

    setEmail(state, payload) {
        state.editUserEmail = payload
    },

    setPhone(state, payload) {
        state.editUserPhone = payload
    },

    setBirthDate(state, payload) {
        state.editUserBirthDate = payload
    },
    setGroup(state, payload) {
        state.editUserGroup = payload
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
        console.log("Loading users...");
        return db.collection("users")
            .get()
            .then(function (snapshots) {
                console.log("Readin users snapshot...");
                onUsersLoaded({ state, commit }, snapshots)
            })
            .catch(error => {
                console.log("Error getting documents: ", error);
            });
    },

    onSelectedUser({ commit }, payload) {
        commit('setSelectedUser', payload)
    },

    openEditUserModal({ state, commit }) {
        if (state.selected.length > 0) {
            state.editUserName = state.selected[0].name
            state.editUserEmail = state.selected[0].email
            state.editUserPhone = state.selected[0].phone
            state.editUserBirthDate = state.selected[0].birth_date
            state.editUserGroup = state.selected[0].group[0]
        }
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

    setGroup({ commit }, payload) {
        commit('setGroup', payload)
    },

    closeEditUserModal({ commit }) {
        commit('setShowEditModal', false)
    },

    save({ state }) {
        if (state.selected[0].id)
            this.dispatch('users/updateUser')
        else
            this.dispatch('users/createUser')
    },

    updateUser({ state }) {
        db.collection("users")
            .doc(state.selected[0].id)
            .update({
                name: state.editUserName,
                email: state.editUserEmail,
                phone: state.editUserPhone,
                birth_date: state.editUserBirthDate,
                group_id: state.editUserGroup.id
            })
            .then(() => { this.dispatch('users/readUsers') })
            .then(() => { this.dispatch('users/closeEditUserModal') })
            .catch(error => {
                console.error("Error updating document: ", error);
            });
    },

    createUser({ state }) { //Create auth module and move the create user in firebase
        auth
            .createUserWithEmailAndPassword(state.editUserEmail, "temporario")
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
                        name: state.editUserName,
                        email: state.editUserEmail,
                        phone: state.editUserPhone,
                        birth_date: state.editUserBirthDate,
                        group_id: state.editUserGroup
                    });
            })
            .then(() => this.dispatch('users/readUsers'))
            .then(() => this.dispatch('users/closeEditUserModal'))
            .catch(error => {
                console.error("Error inserting document: ", error);
            });
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
    console.log("Saving users... ");
    console.log(users);
    context.commit('setUserList', users);
}

function formatDate(date) {
    if (!date) return null;

    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
}

const getters = {
    filterUsersById(state) {
        return (ids) => state.userList.filter(user => ids.includes(user.id));
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}