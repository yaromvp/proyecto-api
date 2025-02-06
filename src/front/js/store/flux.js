const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: undefined,
			favorites: [],
			userId: null,
			user: null,

			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			setToken: async (token) => {
				// Almacena el token en el estado y en localStorage
				setStore({ token: token });
				localStorage.setItem('token', token);

				try {
					// Realiza la solicitud para obtener los datos del usuario
					const response = await fetch(`${process.env.BACKEND_URL}/api/user`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${token}`,
							'Content-Type': 'application/json'
						}
					});

					if (response.ok) {
						const userData = await response.json();
						console.log('Datos del usuario:', userData);

						// Guarda los datos del usuario en el estado
						getActions().setUser(userData);
						
					} else {
						console.error('Error al obtener los datos del usuario');
					}
				} catch (error) {
					console.error('Error en setToken:', error);
				}
			},
			clearToken: () => {
				setStore({ token: undefined })
				localStorage.removeItem('token')
				getActions().clearUser()
			},
			reloadToken: () => {
				const token = localStorage.getItem('token')
				if (token) {
					setStore({ token: token })
					getActions().reloadUser()
				}
			},
			setUser: (userData) => {
				setStore({ user: userData, userId: userData.id })
				localStorage.setItem('user', JSON.stringify(userData))
			},
			clearUser: () => {
				setStore({ user: null, userId: null })
				localStorage.removeItem('user')
			},
			reloadUser: () => {
				const userStr = localStorage.getItem('user')
				if (userStr) {
					const userData = JSON.parse(userStr)
					setStore({ user: userData, userId: userData.id })
				}
			},
		}
	};
};

export default getState;
