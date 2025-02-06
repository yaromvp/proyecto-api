import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../store/appContext';

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const token = store.token;

	return (
		<nav className='navbar navbar-light bg-light'>
			<div className='container'>
				<Link to='/'>
					<span className='navbar-brand mb-0 h1'>React Boilerplate</span>
				</Link>
				<div className='ml-auto gap-3'>

					{
						token ?
							<button
								className='btn btn-danger'
								onClick={() => {
									actions.clearToken();
									navigate("/");
								}}
							>Cerrar Sesión</button>
							:
							<Link to='/login'>
								<button className='btn btn-primary'>Log in</button>
							</Link>
					}
				</div>
			</div>
		</nav>
	);
};
