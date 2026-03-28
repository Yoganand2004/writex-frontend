import React from 'react'
import {useParams} from 'react-router-dom'

function User() {
  let parms = useParams()
  return (
    <div className='bg-success text-white p-3 m-2
    rounded shadow fs-3' >Users : {parms.userID}</div>
  )
}

export default User