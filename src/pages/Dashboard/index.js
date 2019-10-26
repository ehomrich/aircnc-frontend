import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';

import api from '../../services/api';

import './styles.css';

export default function Dashboard() {
    const [spots, setSpots] = useState([]);
    const [requests, setRequests] = useState([]);

    const user_id = localStorage.getItem('user');
    const socket = useMemo(() => socketio('http://localhost:4000', {
        query: { user_id },
    }), [user_id]);

    useEffect(() => {
        socket.on('booking_request', (data) => {
            setRequests([...requests, data]);
        });
    }, [requests, socket]);

    useEffect(() => {
        async function loadSpots() {
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: { user_id },
            })

            setSpots(response.data);
        }

        loadSpots();
    }, []);

    async function handleAccept(id) {
        await api.post(`/bookings/${id}/approvals`);
        setRequests(requests.filter(request => request._id !== id));
    }

    async function handleReject(id) {
        await api.post(`/bookings/${id}/rejections`);
        setRequests(requests.filter(request => request._id !== id));
    }

    return (
        <>
            <ul className="notifications">
                {requests.map(request => {
                    const { _id, date } = request;
                    const { user: { email }, spot: { company } } = request;

                    return (
                        <li key={_id}>
                            <p>
                                <strong>{email}</strong> está solicitando uma reserva em <strong>{company}</strong> para a data: <strong>{date}</strong>
                            </p>
                            <button className="accept" onClick={() => handleAccept(_id)}>Aceitar</button>
                            <button className="reject" onClick={() => handleReject(_id)}>Rejeitar</button>

                        </li>
                    )
                })}
            </ul>

            <ul className="spot-list">
                {spots.map(spot => (
                    <li key={spot._id}>
                        <header style={{
                            backgroundImage: `url(${spot.thumbnail_url})`
                        }} />
                        <strong>{spot.company}</strong>
                        <span>{spot.price ? `R$ ${spot.price}/dia` : 'Gratuito'}</span>
                    </li>
                ))}
            </ul>

            <Link to='/new'>
                <button className="btn">Cadastrar novo spot</button>
            </Link>
        </>
    );
}