
import { db } from "@/main";
import { moment } from "@/main";

const state = () => ({
    orders: [],
});

const mutations = {
    setOrders(state, payload) {
        state.orders = payload
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

const actions = {
    loadOrders(context) {
        console.log('Loading orders...');
        db.collection("serviceOrder")
            .get()
            .then(function (snapshots) {
                return onServiceOrdersLoaded(context, snapshots);
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
                !filters.startedAt || order.creation_date >= filters.startedAt &&
                !filters.endedAt || order.creation_date <= filters.endedAt);
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
                !filters.startedAt || order.creation_date >= filters.startedAt &&
                !filters.endedAt || order.creation_date <= filters.endedAt);
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
                !filters.startedAt || order.creation_date >= filters.startedAt &&
                !filters.endedAt || order.creation_date <= filters.endedAt);
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
                !filters.startedAt || order.creation_date >= filters.startedAt &&
                !filters.endedAt || order.creation_date <= filters.endedAt);
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
                !filters.startedAt || order.creation_date >= filters.startedAt &&
                !filters.endedAt || order.creation_date <= filters.endedAt);
            let groupedOrders = filteredOrders.groupBy(m => m.client.id);
            let data = [];
            groupedOrders.forEach(group => {
                data.push({
                    client: group[0].client.name,
                    spentTimeInDays: group.sum(m => {
                        var start = moment(m.creation_date, "DD/MM/YYYY");
                        var end = m.end_date ? moment(m.end_date, "DD/MM/YYYY") : moment().endOf('day');
                        return Math.round((end - start) / (1000 * 3600 * 24));
                    })
                });
            });
            return data;
        }
    },

    getWorkedHoursByClients(state) {
        return (filters) => {
            let filteredOrders = state.orders.filter(order =>
                !filters.startedAt || order.creation_date >= filters.startedAt &&
                !filters.endedAt || order.creation_date <= filters.endedAt);
            let groupedOrders = filteredOrders.groupBy(m => m.client.id);
            let data = [];
            groupedOrders.forEach(group => {
                data.push({
                    client: group[0].client.name,
                    spentTimeInHours: group.sum(m => {
                        var start = moment(m.creation_date, "DD/MM/YYYY");
                        var end = m.end_date ? moment(m.end_date, "DD/MM/YYYY") : moment();
                        return Math.round((end - start) / (1000 * 3600));
                    })
                });
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
