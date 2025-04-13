import React from 'react'
import Home from '../User/Homepage/Home'
import {Routes, Route} from 'react-router-dom'
import Sidebar from '../Admin/SideBar/Sidebar'

import '../Routes/show.css'
import Dashboard from '../Admin/Dashboard/Dashboard'
import BookManager from '../Admin/Books/BookManager'
import AddBooks from '../Admin/Books/AddBooks'
import Login from '../Auth/Login'
import PrivateRoute from '../PrivateRoute'
import Details from '../Admin/Books/Details'
import EditBooks from '../Admin/Books/EditBooks'
import Logout from '../Auth/Logout'
import Accounts from '../Admin/Accounts/Accounts'
import Signup from '../Auth/Register'
import ReservationTable from '../Admin/Reservations/Reservation'
import BookDetails from '../User/DetailPage/PageDetail'
import Profile from '../Admin/Profile/Profile'
import UserProfile from '../User/UserProfile/UserProfile'

function ShowRoutes() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Signup/>}/>

      <Route path='/user/*' element={
        <PrivateRoute>
          <Routes>
          <Route path='/home' element={<Home/>}></Route>
          <Route path='/details/:id' element={<BookDetails/>}/>
          <Route path='/profile' element={<UserProfile/>}/>
          <Route path='/logout' element={<Logout/>}/>
          </Routes>
        </PrivateRoute>
      }/>
     
     <Route path='/admin/*' element={
      <div className='window'>
        <Sidebar/>
        <div className="content">
          <PrivateRoute>
         <Routes>
          <Route path='dashboard' element={<Dashboard/>}></Route>
          <Route path='books' element={<BookManager/>}/>
          <Route path='add_books' element={<AddBooks/>}/>
          <Route path='book_detail/:id' element={<Details/>}/>
          <Route path='edit_book/:id' element={<EditBooks/>}/>
          <Route path='user_accounts' element={<Accounts/>}/>
          <Route path='reservations' element={<ReservationTable/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path='logout' element={<Logout/>}/>
         </Routes>
          </PrivateRoute>
        </div>
      </div>
     }></Route>
    </Routes>
    </>
  )
}

export default ShowRoutes
