import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';


const ForgotPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const userValid = async () => {
    try {
      
      const res = await axios.get(`https://alumni-server-beta.vercel.app/api/v1/users/forgotpassword/${id}/${token}`);
     

      if (res.status === 200) {
        console.log('User is valid');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/');
    }
  };

  const setVal = (e) => {
    setPassword(e.target.value);
  };

  const sendPassword = async (e) => {
    e.preventDefault();

    try {
      if (password === '') {
        toast.error('Password is required!', {
          position: 'top-center',
        });
      } else if (password.length < 6) {
        toast.error('Password must be at least 6 characters!', {
          position: 'top-center',
        });
      } else {
        const res = await axios.post(`https://alumni-server-beta.vercel.app/api/v1/users/changepassword/${id}/${token}`, {
          newPassword:password,
        });

        if (res.status === 200) {
          setPassword('');
          setMessage('Password successfully updated');
        } else {
          toast.error('Error updating password. Please try again.', {
            position: 'top-center',
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating password. Please try again.', {
        position: 'top-center',
      });
    }
  };

  useEffect(() => {
    userValid();
    setTimeout(() => {
      setData(true);
    }, 3000);
  }, []);

  return (
    <>
      {data ? (
        <section className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8 bg-amber-100 rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Enter Your NEW Password
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={sendPassword}>
              {message && (
                <p className={`text-${message.includes('successfully') ? 'green' : 'red'}-500 font-bold`}>
                  {message}
                </p>
              )}
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="password" className="sr-only">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={setVal}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="New Password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update Password
                </button>
              </div>
            </form>
            <p className="text-sm text-center mt-4">
              <NavLink
                to="/"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back to Home
              </NavLink>
            </p>
          </div>
        </section>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default ForgotPassword;

