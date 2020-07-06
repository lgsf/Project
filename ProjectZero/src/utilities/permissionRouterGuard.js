function hasPermissionsNeeded(route, permission) {
    if (permission.some(e => e.route === route.path)) {
        return true
      }
    else{
        return false
    }   
}

export default hasPermissionsNeeded