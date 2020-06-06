
import { db } from "@/main";

const state = () => ({
    selected: undefined,
    search: '',
    productionOrders: []
});

const mutations = {
    selectOrder(state, payload) {
        state.selected = payload
    },
    searchFor(state, payload) {
        state.search = payload
    },
    updateOrders(state, payload) {
        state.productionOrders = payload
    },
};


function onProductionOrdersLoaded(payload) {
    let productionOrders = [];
    payload.forEach(orderSnapShot => {
        let orderData = orderSnapShot.data();
        orderData.id = orderSnapShot.id;
        productionOrders.push(orderData);
    });
    return new Promise(function (resolve, reject) {
        if (!productionOrders)
            reject(productionOrders);
        else
            resolve(productionOrders);
    })
}

function getOrderUsersIds(productionOrders) {
    let userIds = [];
    productionOrders.forEach(order => {
        userIds.push(order.administrator);
        userIds = userIds.concat(order.users);
        userIds = userIds.unique();
    });
    return userIds;
}

function completeOrdersWithUsersInformation(productionOrders, users) {
    productionOrders.forEach(order => {
        order.administratorName = users.filter(u => u.id == order.administrator)[0].name;
        order.usersList = order.users.map(u => ({
            id: u,
            name: users.filter(m => m.id == u)[0].name
        }));
    });
}

// function createNewClient(state) {
//     return db.collection("clients")
//         .add({
//             name: state.editingName || "",
//             email: state.editingEmail || "",
//             cnpj: state.editingCnpj || ""
//         });
// }

// function updateExistingClient(state) {
//     return db.collection("clients")
//         .doc(state.selected.id)
//         .set({
//             name: state.editingName || "",
//             email: state.editingEmail || "",
//             cnpj: state.editingCnpj || ""
//         });
// }

Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

const actions = {
    selectOrder(context, payload) {
        var selected = !payload ? undefined : payload[0];
        context.commit('selectOrder', selected)
    },
    searchFor(context, payload) {
        context.commit('searchFor', payload)
    },
    reloadOrders(context) {
        let self = this;
        db.collection("productionOrder")
            .get()
            .then(onProductionOrdersLoaded)
            .then(function (productionOrders) {
                self.dispatch('clients/loadUsers').then(function () {
                    let userIds = getOrderUsersIds(productionOrders);
                    let users = context.rootGetters['clients/filterUsersById'](userIds);
                    completeOrdersWithUsersInformation(productionOrders, users);
                    context.commit('updateOrders', productionOrders);
                })
            });
    }
};
const getters = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

