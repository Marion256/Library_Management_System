import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import axios from 'axios';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

const baseURL = 'https://lms-n8b3.onrender.com';

const UseAxios = () => {
  const { setUser, authTokens, setAuthTokens } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem("authtokens"));
    if (tokens) {
      setAuthTokens(tokens);
      setUser(jwtDecode(tokens.access));
    }
    setIsLoading(false);
  }, []);

  // Create base Axios instance without auth headers
  const axiosInstance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  // Add request interceptor only if we have authTokens
  if (authTokens) {
    axiosInstance.interceptors.request.use(async (req) => {
      const user = jwtDecode(authTokens.access);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

      if (!isExpired) {
        req.headers.Authorization = `Bearer ${authTokens.access}`;
        return req;
      }

      try {
        const response = await axios.post(`${baseURL}/api/token/refresh/`, {
          refresh: authTokens.refresh,
        });

        localStorage.setItem("authtokens", JSON.stringify(response.data));
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));

        req.headers.Authorization = `Bearer ${response.data.access}`;
        return req;
      } catch (error) {
        console.error("Error refreshing token:", error);
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authtokens');
        Swal.fire({
          icon: 'success',
          title: 'Your session has expired',
          text: 'You have been logged out.',
          timer: 6000,
          confirmButtonText: 'OK'
        });
        window.location.href = '/';
        return Promise.reject(error);
      }
    });
  }

  return axiosInstance;
};

export default UseAxios;