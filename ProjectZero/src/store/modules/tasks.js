import { db } from "@/main";

const state = () => ({
    tasksList: [],
});

const mutations = {
    setTasksList(state, payload) {
        state.tasksList = payload
    },
};

const actions = {
    readTasks({ commit }) {
        db.collection("tasks")
            .get()
            .then(function (snapshots) {
                let tasks = [];
                snapshots.forEach(taskSnapShot => {
                    let taskData = taskSnapShot.data();
                    taskData.id = taskSnapShot.id;
                    tasks.push(taskData);
                });
                commit('setTasksList', tasks);
            })
            .catch(error => {
                console.log("Error getting documents: ", error);
            });
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}