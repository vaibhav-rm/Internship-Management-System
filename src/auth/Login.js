import React, { useState, useRef, useContext } from "react";
import logo from "./../sangwin-logo.png";
import './Login.css';
import AuthContext from "./auth-context";
import axios from 'axios';
import { Navigate } from "react-router-dom";

function Login() {
    const authCtx = useContext(AuthContext);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email: emailRef.current.value,
                password: passwordRef.current.value
            });

            const token = response.data.token;
            authCtx.login(token);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in. Please try again.');
        }
    };

    if (authCtx.isLoggedIn === true) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg">
                <div className="logo-container mb-8 text-center">
                    <img src={logo} alt="Sangwin Gawande" className="w-32 mx-auto" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input ref={emailRef} id="email" name="email" type="email" required
                               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input ref={passwordRef} id="password" name="password" type="password" required
                               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none disabled:opacity-50">
                        {isSubmitted ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="notes-panel mt-4">
                    <h4 className="text-center text-gray-700">Notes:</h4>
                    <p className="text-center text-sm text-gray-600">Credentials: rathodvaibhav401@gmail.com & admin123</p>
                    <p className="text-center text-sm text-gray-600">All data will be reset when the window is refreshed</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
