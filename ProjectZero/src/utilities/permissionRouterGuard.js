function hasPermissionsNeeded(to, from, permission) {
    if (permission.some(e => e.route === to.path)) {
        return true
      }
    else if (from.path === "/" && permission.length === 0) {
        return true
    }
    else if (from.path === "/serviceOrder") {
        return true
    }
    else {
        return false
    }   
}

export default hasPermissionsNeeded