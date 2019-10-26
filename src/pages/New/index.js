import React, { useState, useMemo } from 'react';

import api from '../../services/api';

import './styles.css';
import camera from '../../assets/camera.svg';

export default function New({ history }) {
    const [thumbnail, setThumbnail] = useState(null);
    const [company, setCompany] = useState('');
    const [techs, setTechs] = useState('');
    const [price, setPrice] = useState(0);

    const preview = useMemo(
        () => thumbnail ? URL.createObjectURL(thumbnail) : null,
        [thumbnail],
    );

    async function handleSubmit(event) {
        event.preventDefault();

        const user_id = localStorage.getItem('user');

        const data = new FormData();
        data.append('thumbnail', thumbnail);
        data.append('company', company);
        data.append('techs', techs);
        data.append('price', price);

        await api.post('/spots', data, {
            headers: { user_id },
        });

        history.push('/dashboard');
    }

    return (
        <form onSubmit={handleSubmit}>
            <label
                id="thumbnail"
                className={thumbnail ? 'has-thumbnail' : ''}
                style={{ backgroundImage: `url(${preview})` }}
            >
                <input
                    type="file"
                    onChange={event => setThumbnail(event.target.files[0])}
                />
                <img src={camera} alt="Adicionar imagem" />
            </label>

            <label htmlFor="company">Empresa <span className="required">*</span></label>
            <input
                type="text"
                id="company"
                placeholder="Sua empresa incrível"
                value={company}
                onChange={event => setCompany(event.target.value)}
            />

            <label htmlFor="techs">
                Tecnologias <span className="required">*</span> <span className="help-text">(separadas por vírgula)</span>
            </label>
            <input
                type="text"
                id="techs"
                placeholder="Quais tecnologias usam?"
                value={techs}
                onChange={event => setTechs(event.target.value)}
            />

            <label htmlFor="price">
                Valor da diária <span className="required">*</span> <span className="help-text">(em branco para gratuito)</span>
            </label>
            <input
                type="number"
                id="price"
                placeholder="Valor cobrado por dia"
                min="0"
                value={price}
                onChange={event => setPrice(event.target.value)}
            />

            <button type="submit" className="btn">Cadastrar</button>
        </form>
    );
}