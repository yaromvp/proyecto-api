import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

export function Login() {
    const { actions } = useContext(Context)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formStatus, setFormStatus] = useState({ loading: false, ready: false, message: null });
    const navigate = useNavigate()

    const loginUser = async (e) => {
        e.preventDefault();
        setFormStatus({ ...formStatus, loading: true, ready: false });

        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                actions.setToken(data.token);
                actions.setUser(data.user);
                setFormStatus({ loading: false, ready: true, message: 'Successful credentials!' });
            } else {
                setFormStatus({ loading: false, ready: false, message: data.message || 'Error al crear la cuenta.' });
            }
        } catch (error) {
            console.error('Error creating user:', error);
            setFormStatus({ loading: false, message: 'Error en el servidor. Por favor inténtalo de nuevo en un momento.' });
        }
    };

    useEffect(() => {
        if (formStatus.ready === true) {
            navigate('/profile')
        }
    }, [formStatus.ready])

    return (
        <main className='d-flex flex-column vh-100 justify-content-center align-items-center'>
            <h1>Login</h1>
            <form onSubmit={loginUser}>
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