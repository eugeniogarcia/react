import axios from 'axios'

const baseURL= 'http://localhost:3000/api';

const api = axios.create({
    baseURL: baseURL,
})

export const busca = async (peticion) => {
    //let valorEnCache =window.localStorage.getItem(baseURL + peticion);
    let valorEnCache = window.sessionStorage.getItem(baseURL + peticion);
    if (valorEnCache) {
        return JSON.parse(valorEnCache);
    }
    else {
        let response = await api.get(baseURL+peticion)
        if (response) {
            //window.localStorage.setItem(baseURL + peticion, JSON.stringify(response));
            window.sessionStorage.setItem(baseURL + peticion, JSON.stringify(response));
        }
        else {
            console.log("No se encontro nada");
        }
        return response;
    }
}

export const insertMovie = payload => api.post(`/movie`, payload)
export const getAllMovies = () => api.get(`/movies`)
export const updateMovieById = (id, payload) => api.put(`/movie/${id}`, payload)
export const deleteMovieById = id => api.delete(`/movie/${id}`)
export const getMovieById = id => api.get(`/movie/${id}`)

const apis = {
    busca,
    insertMovie,
    getAllMovies,
    updateMovieById,
    deleteMovieById,
    getMovieById,
}

export default apis