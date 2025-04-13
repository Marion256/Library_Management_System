import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import UseAxios from '../UseAxios/AxiosInstance'
import {AuthContext} from '../Context/AuthProvider'

const BASE_URL = 'http://127.0.0.1:8000/books/'
function useHook() {
  const {user} = useContext(AuthContext)
const axiosInstance = UseAxios()
const LIST_BOOKS = `${BASE_URL}list_books`
const SINGLE_USER = `${BASE_URL}single_user/${user?.user_id}`

const [listBooks, setListBooks] = useState([])
const [dateFormat, setDateFormat] = useState();
const [isLoading, setIsLoading] = useState(false)
const [person, setPerson] = useState({first_name:"", last_name:"", email:"", username:"", date_joined:"", is_staff:"", is_customer:""})

  // format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };


const fetchUser = async()=>{
  try{
    setIsLoading(true)
   const response = await axiosInstance.get(SINGLE_USER)
   const data = response.data
   const formattedDate = formatDate(data.date_joined);
   setDateFormat(formattedDate);
   setPerson(data)
  }catch(err){
    console.log(err)
  }finally {
    setIsLoading(false)
  }
}

const fetchBooks = async()=>{
    try{
    const response = await axiosInstance.get(LIST_BOOKS)
    const {results} = response.data
    setListBooks(results)
    }catch(err){
        console.log('book list', err)
    }
}

useEffect(()=>{
  fetchBooks()
  fetchUser()
}, [user?.user_id])
  return {
    listBooks,
    person,
    setPerson,
    fetchBooks,
    dateFormat,
    isLoading
  }
}

export default useHook
