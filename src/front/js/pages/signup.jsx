import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formStatus, setFormStatus] = useState({ loading: false, ready: false, message: null });
    const navigate = useNavigate()

    const isFormValid = () => {
        if (!email || !password) {
            setFormStatus({ loading: false, ready: false, message: "All fields are required." });
            return false;
        }
        return true;
    };

    const registerUser = async (e) => {
        e.preventDefault();
        if (!isFormValid()) return;
        setFormStatus({ ...formStatus, loading: true, ready: false });

        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                setFormStatus({ loading: false, ready: true, message: "User successfully created! You will be redirected to Log in." });
            } else {
                setFormStatus({ loading: false, ready: false, message: data.message || "Error creating user" });
            }
        } catch (error) {
            console.error("Error creating user:", error);
            setFormStatus({ loading: false, message: "Server error. Please try again later." });
        }
    };

    useEffect(() => {
        if (formStatus.ready) {
            const timer = setTimeout(() => navigate("/login"), 1000);
            return () => clearTimeout(timer);
        }
    }, [formStatus.ready, navigate]);

    return (
        <main className='d-flex flex-column vh-100 justify-content-center align-items-center'>
            <h1>Sign up</h1>
            <form onSubmit={registerUser}>
                <div className='mb-3'>
                    <label htmlFor='inputEmail' className='form-label'>Email address</label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='form-control'
                        id='inputEmail'
                        aria-describedby='emailHelp'
                    />
                    <div id='emailHelp' className='form-text'>We'll never share your email with anyone else.</div>
                </div>
                <div className='mb-3'>
                    <label htmlFor='inputPassword' className='form-label'>Password</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='form-control'
                        id='inputPassword'
                    />
                </div>

                {
                    formStatus.loading ? (
                        <div className='d-flex justify-content-center'>
                            <div className='spinner-border text-primary text-center' role='status'>
                                <span class='visually-hidden'>Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className='text-center'>
                            <button type='submit' className='btn btn-primary'>Iniciar Sesión</button>
                        </div>
                    )
                }
                {
                    formStatus.message && (
                        <div
                            className={`alert mt-3 ${formStatus.message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}
                            role='alert'
                        >
                            {formStatus.message}
                        </div>
                    )
                }

            </form>
        </main>
    );
}