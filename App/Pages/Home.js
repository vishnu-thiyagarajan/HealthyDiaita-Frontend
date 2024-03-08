import React, { useContext } from 'react'
import HomeClient from './HomeClient'
import { AuthContext } from '../Context/AuthContext'
import HomeAdmin from './HomeAdmin';

function Home() {
  const {userData} = useContext(AuthContext);
  switch(userData?.role){
    case 'Admin':
        return <HomeAdmin />
    case 'Client': 
        return <HomeClient />
    default:
        return <></>
  }
}

export default Home
