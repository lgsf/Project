function hasPermissionsNeeded(route, from, permission) {
    if (permission.some(e => e.route === route.path)) {
        return true
      }
    else if(from.path === "/serviceOrder") {
        return true
    }
    else {
        return false
    }   
}

export default hasPermissionsNeeded