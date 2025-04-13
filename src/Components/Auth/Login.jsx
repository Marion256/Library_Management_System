import React, {useContext, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import '../Auth/auth.css'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthProvider'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'

const login = 'https://lms-n8b3.onrender.com/books/login'

function Login() {
const { setUser} = useContext(AuthContext);
  const [authTokens, setAuthTokens] = useState(() => JSON.parse(localStorage.getItem('authtokens')) || null);
  const [noActive, setNoActive] = useState('');
  const [userLogin, setUserLogin] = useState({ username: "", password: "" });
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e)=>{
   const {name, value} = e.target
   setUserLogin({...userLogin, [name]:value})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    const formData = new FormData();
    formData.append("username", userLogin.username);
    formData.append("password", userLogin.password);

    axios.post(login, formData)
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          const data = response.data;
          setLoader(false);
          localStorage.setItem('authtokens', JSON.stringify(data));
          setAuthTokens(data);
          setUser(jwtDecode(data.access));
          showSuccessAlert("Logging in...");
        } else {
          showErrorAlert("Please provide correct username/password");
        }
      })
      .catch(err => {
        console.log("Error", err);
        if (err.response.data.detail) {
          setNoActive(err.response.data.detail);
        }
      }).finally(() => {
        setLoader(false);
      });
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: message,
      icon: "success",
      timer: 6000,
      toast: true,
      position: 'top',
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: message,
      icon: "error",
      timer: 6000,
      toast: true,
      position: 'top',
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    console.log("Auth tokens:", authTokens);
  
    if (authTokens) {
      const decodedUser = jwtDecode(authTokens.access);
      console.log("Decoded user:", decodedUser);
  
      setUser(decodedUser);

      {decodedUser.is_customer && navigate('/user/home')}
      {decodedUser.is_staff && navigate('/admin/dashboard')}
    }
  }, [authTokens]);
  
  return (
    <>
    <div className="login_wrapper">
    <div className="login-container">
    {noActive && <p className='alert alert-warning'>{noActive}</p>}
  <h2>LMS Login</h2>
  <form id="patientLoginForm" onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="formGroupExampleInput" className="form-label">
      Username/Email
    </label>
    <input
      type="text"
      className="form-control"
      id="formGroupExampleInput"
      name='username'
      value={userLogin.username}
      onChange={handleChange}
    />
  </div>

     <div className="mb-3">
    <label htmlFor="formGroupExampleInput2" className="form-label">
      Password
    </label>
    <input
      type="password"
      className="form-control"
      id="formGroupExampleInput2"
      name='password'
      value={userLogin.password}
      onChange={handleChange}
    />
  </div>
    <button type="submit" className="login-button">
      {loader ? 'Loggin in...' : 'Login'}
    </button>
    <div id="errorMessage" className="error-message" />
    <p>Arleady have an  account? <Link to='/register'>Sign up</Link></p>
  </form>
</div>
    </div>
   
    </>
  )
}

export default Login
