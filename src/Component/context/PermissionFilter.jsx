const checkPermissions=(
    currentPermissions,
    requiredPermissions = [],
    checkAll = true
)=> {
    /** No permissions required, so it's cool, saves us the trouble
        and allows for early exit.
     */
    if (!requiredPermissions) {
        return true;
    }
    /** If there is only one required permission, wrap it in an array
        for further convenience.    
     */
    if (!Array.isArray(requiredPermissions)) {
        requiredPermissions = [requiredPermissions];
    }

    /** Check every or some, dead simple. */
    if (checkAll) {
        return requiredPermissions.every((p) => currentPermissions && currentPermissions.includes(p));
    }
    return requiredPermissions.some((p) => currentPermissions && currentPermissions.includes(p));
}
export default checkPermissions