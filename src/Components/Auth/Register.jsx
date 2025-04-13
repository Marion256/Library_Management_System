import React, { useState } from 'react';
import '../Auth/auth.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const register = 'http://127.0.0.1:8000/books/register';

function Signup() {
    const navigate = useNavigate()
  const [Customer, setCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    is_customer: true,
  });

  const [error, setError] = useState("");
  const [userError, setUserError] = useState('')
  const [load, setLoad] = useState(false)

  const handleChange = (e) => {
    const { name, value} = e.target;
    setCustomer({
      ...Customer,
      [name]:value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   setLoad(true)
    // Basic validation
    if (Customer.password !== Customer.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post(register, Customer)
      .then(res =>{
          console.log('response', res)
          if(res.status === 201){
            setLoad(false)
            Swal.fire({
                title: 'Registration successfull',
                icon: "success",
                timer: 6000,
                toast: true,
                position: 'top',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
        navigate('/login')
      }).catch(err =>{
        setLoad(false)
        setUserError(err.response.data.email)
        console.log('err', err)
      })
     
      // Redirect or show success message
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <>
    <div className="sign-wrapper">
    <div className="registration-container mt-5">
  <h2>User Registration</h2>
  <form id="registrationForm" onSubmit={handleSubmit}>
  <div className="mb-3">
            <label htmlFor="first_name" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="first_name"
              name="first_name"
              value={Customer.first_name}
              onChange={handleChange}
              required
            />
          </div>

     <div className="mb-3">
            <label htmlFor="last_name" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="last_name"
              name="last_name"
              value={Customer.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={Customer.email}
              onChange={handleChange}
              required
            />
            {userError && <p className='text-danger'>{userError}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={Customer.password}
              onChange={handleChange}
              required
            />
          </div>

    <div className="mb-3">
            <label htmlFor="confirm_password" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirm_password"
              name="confirm_password"
              value={Customer.confirm_password}
              onChange={handleChange}
              required
            />
          </div>

    <button type="submit" className="register-button">
      {load ? 'Registering...' : 'Register'}
    </button>
    <div id="formError" className="error-message" />
  </form>
  <p className="login-link">
    Already have an account? <Link to='/login'>Login here</Link>
  </p>
</div>
    </div>
   
    </>
  );
}

export default Signup;