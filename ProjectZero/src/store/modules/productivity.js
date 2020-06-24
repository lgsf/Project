
import { db } from "@/main";
import { moment } from "@/main";

const state = () => ({
    orders: [],
    sessionInfos: []
});

const mutations = {
    setOrders(state, payload) {
        state.orders = payload;
    },
    setSessionInfos(state, payload) {
        state.sessionInfos = payload;
    }
};


function onServiceOrdersLoaded(context, payload) {
    let orders = [];
    payload.forEach(ordersSnapShot => {
        let orderData = ordersSnapShot.data();
        orderData.id = ordersSnapShot.id;
        orders.push(orderData);
    });
    context.commit('setOrders', orders);
    return new Promise(function (resolve, reject) {
        if (!orders.length)
            reject(orders);
        else
            resolve(orders);
    });
}


function onSessionInfosLoaded(context, payload) {
    let infos = [];
    payload.forEach(infosSnapShot => {
        let infoData = infosSnapShot.data();
        infoData.id = infosSnapShot.id;
        infoData.sessionDate = moment.unix(infoData.sesstion_start);
        infos.push(infoData);
    });
    context.commit('setSessionInfos', infos);
    return new Promise(function (resolve, reject) {
        if (!infos.length)
            reject(infos);
        else
            resolve(infos);
    });
}

const actions = {
    loadOrders(context) {
        db.collection("serviceOrder")
            .get()
            .then(function (snapshots) {
                return onServiceOrdersLoaded(context, snapshots);
            });
    },
    loadSessionInfo(context) {
        db.collection("userSessionInfo")
            .get()
            .then(function (snapshots) {
                return onSessionInfosLoaded(context, snapshots);
            });
    }
};

Array.prototype.groupBy = function (keyGetter) {
    const map = new Map();
    this.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

Array.prototype.sum = function (keyGetter) {
    if (!this || !this.length)
        return 0;

    return this.reduce(function (a, b) {
        let key = keyGetter(b);
        return !key ? a : a + key;
    }, 0);
};

const getters = {
    filterOrdersGroupedByClients(state) {
        return (filters) => {
            let filteredOrders = state.orders.filter(order =>
                (!filters.startedAt || order.creation_date >= filters.startedAt) &&
                (!filters.endedAt || order.creation_date <= filters.endedAt));
            let groupedOrders = filteredOrders.groupBy(m => m.client.id);
            let data = [];
            groupedOrders.forEach(group => {
                data.push({
                    client: group[0].client.name,
                    ordersCount: group.length
                });
            });
            return data;
        }
    },
    filterOrdersGroupedByUsers(state, getters, rootState) {
        return (filters) => {
            let filteredOrders = state.orders.filter(order =>
                (!filters.startedAt || order.creation_date >= filters.startedAt) &&
                (!filters.endedAt || order.creation_date <= filters.endedAt));
            let mapOrders = filteredOrders.map(order => ({
                id: order.id,
                users: order.users.map(m => m.id),
                groups: order.userGroups.map(m => m.id)
            }));

            let allUsers = rootState.users.userList;
            let ordersPerUsers = [];
            allUsers.forEach(user => {
                ordersPerUsers.push({
                    user: user,
                    ordersCount: mapOrders.filter(m => m.users.includes(user.id) || m.groups.includes(user.group_id.id)).length
                })
            });
            let unassignedOrders = filteredOrders.filter(m => m.users.length == 0 && m.userGroups.length == 0);
            ordersPerUsers.push({ user: { name: 'sem atribuição' }, ordersCount: unassignedOrders.length });
            ordersPerUsers = ordersPerUsers.filter(m => m.ordersCount > 0);
            return ordersPerUsers;
        }
    },

    filterTasksGroupedByClients(state) {
        return (filters) => {
            let filteredOrders = state.orders.filter(order =>
                (!filters.startedAt || order.creation_date >= filters.startedAt) &&
                (!filters.endedAt || order.creation_date <= filters.endedAt));
            let groupedOrders = filteredOrders.groupBy(m => m.client.id);
            let data = [];
            groupedOrders.forEach(group => {
                data.push({
                    client: group[0].client.name,
                    tasksCount: group.sum(m => m.tasks?.length || 0)
                });
            });
            return data;
        }
    },
    filterTasksGroupedByUsers(state, getters, rootState) {
        return (filters) => {
            let filteredOrders = state.orders.filter(order =>
                (!filters.startedAt || order.creation_date >= filters.startedAt) &&
                (!filters.endedAt || order.creation_date <= filters.endedAt));
            let tasks = filteredOrders.flatMap(a => a.tasks);
            if (!tasks || !tasks.length)
                return [];
            let mapTasks = tasks.filter(m => !!m.users.id).map(task => ({
                id: task.id,
                users: task?.users?.id
            }));

            let allUsers = rootState.users.userList;
            let tasksPerUsers = [];
            allUsers.forEach(user => {
                tasksPerUsers.push({
                    user: user,
                    tasksCount: mapTasks.filter(m => m.users.includes(user.id)).length
                });
            });
            let unassignedTasks = tasks.filter(m => !m.users?.id);
            tasksPerUsers.push({ user: { name: 'sem atribuição' }, tasksCount: unassignedTasks.length });
            tasksPerUsers = tasksPerUsers.filter(m => m.tasksCount > 0);
            return tasksPerUsers;
        }
    },

    getWorkedDaysByClients(state) {
        return (filters) => {
            let filteredOrders = state.orders.filter(order =>
                (!filters.startedAt || order.creation_date >= filters.startedAt) &&
                (!filters.endedAt || order.creation_date <= filters.endedAt));
            let groupedOrders = filteredOrders.groupBy(m => m.client.id);
            let data = [];
            groupedOrders.forEach(group => {
                data.push({
                    client: group[0].client.name,
                    spentTimeInDays: group.sum(m => {
                        var start = m.creation_date;
                        var end = m.end_date || moment().endOf('day').unix();
                        return Math.round((end - start) / (3600 * 24));
                    })
                });
            });
            return data;
        }
    },
    getWorkedHoursByClients(state) {
        return (filters) => {
            let filteredOrders = state.orders.filter(order =>
                (!filters.startedAt || order.creation_date >= filters.startedAt) &&
                (!filters.endedAt || order.creation_date <= filters.endedAt));
            let groupedOrders = filteredOrders.groupBy(m => m.client.id);
            let data = [];
            groupedOrders.forEach(group => {
                data.push({
                    client: group[0].client.name,
                    spentTimeInHours: group.sum(m => {
                        var start = m.creation_date;
                        var end = m.end_date || moment().endOf('day').unix();
                        return Math.round((end - start) / (3600));
                    })
                });
            });
            return data;
        }
    },

    getWorkedHoursByUsersByDate(state, getters, rootState) {
        return (filters) => {
            let filteredInfos = state.sessionInfos.filter(info =>
                (!filters.startedAt || info.sesstion_start >= filters.startedAt) &&
                (!filters.endedAt || info.session_end <= filters.endedAt));


            filteredInfos.forEach(elem => elem.workingDate = elem.sessionDate.format("DD/MM/YYYY"));
            filteredInfos = filteredInfos.sort((m, n) => m.sesstion_start > n.sesstion_start ? 1 : -1);
            let period = [...new Set(filteredInfos.map(m => m.workingDate))];


            let infosGroupedById = filteredInfos.groupBy(m => m.uid);
            let data = [];
            let allUsers = rootState.users.userList;
            infosGroupedById.forEach(user => {
                let userData = {
                    uid: user[0].uid,
                    user: allUsers.reduce((a, b) => a.id == user[0].uid ? a : b, 0),
                    workedHoursByDay: []
                };
                let daysWorked = user.groupBy(m => m.workingDate);
                period.forEach(day => {
                    let dayData = daysWorked.get(day) || [{ workingDate: day, session_end: 0, sesstion_start: 0 }];
                    userData.workedHoursByDay.push({
                        day: dayData[0].workingDate,
                        hours: Math.round(dayData.sum(m => (m.session_end - m.sesstion_start)) / 60)
                    });
                });
                data.push(userData);
            });
            return data;
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
