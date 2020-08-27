function hasPermissionsNeeded(to, from, permission) {
    if (permission.some(e => e.route === to.path)) {
        return true
    }
    else if (to.path === "/profile") {
        return true
    }
    else if (from.path === "/" && to.path === "/home" && permission.length === 0) {
        return true
    }
    else if (to.path === "/users" || to.path === "/groups" && permission.some(e => e.route === "/team")) {
        return true
    }
    else if (to.path.includes("/editServiceOrder/") && permission.some(e => e.route === "/serviceOrder")) {
        return true
    }
    else {
        return false
    }   
}

export default hasPermissionsNeeded