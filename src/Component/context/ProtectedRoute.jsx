import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import checkPermissions from './PermissionFilter'
import ResPrivate from './ResPrivate'
function PrivateRoute() {
    const permissionArr = JSON.parse(localStorage.getItem('userInfo'))
    const access = checkPermissions(permissionArr&&permissionArr.Permissions,["User"])   
  return (
    access ? <Outlet />:<ResPrivate />
  )
}

export default PrivateRoute