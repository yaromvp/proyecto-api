import React from "react";
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

export function Profile() {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.token === undefined && localStorage.getItem('token') == undefined) {
            navigate('/login')
            return;
        }
    }, [store.token]);

    return (
        <main className='d-flex flex-column vh-100 justify-content-center align-items-center'>
            <h1>Profile</h1>
            <h2>{store.user?.id}</h2>
            <h2>{store.user?.email}</h2>
        </main>
    );
}