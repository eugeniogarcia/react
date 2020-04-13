import fetch from 'isomorphic-fetch';
import Cookies from 'js-cookie';

var ENDPOINT = "http://localhost:3000";

/**
 * Generates a Fetch configuration object so we can share headers
 * @method generateFetchConfig
 * @param  {string}            method      HTTP verb
 * @param  {object}            [body=null] payload for post/put
 * @return {object}                        config
 */
function generateFetchConfig(method, body = null) {
    const upCasedMethod = method.toUpperCase();
    const token = Cookies.get('eltoken');
    const config = {
        method: upCasedMethod,
        headers: {
            'Content-Type': 'application/json',
            'miToken': token
        },
        /*
        credentials (String) - Authentication credentials mode. Default: "omit"
            "omit" - don't include authentication credentials (e.g. cookies) in the request
            "same-origin" - include credentials in requests to the same site
            "include" - include credentials in requests to all sites
        */
        credentials: 'same-origin'
    };
    if (['POST', 'PUT'].includes(upCasedMethod)) {
        config.body = JSON.stringify(body);
    }
    return config;
}


/**
 * Recupera un comentario
 * @method recuperaComentario
 * @param  {string}  id post ID
 * @return {Response}     Fetch Response object
 */
export function recuperaComentario(id) {
    console.log(ENDPOINT);
    return fetch(`${ENDPOINT}/comments/${id}`,generateFetchConfig("GET")
    );
}


/**
 * Borra Comentario
 * @method borraComentario
 * @param  {string}   postId
 * @param  {string}   userId
 * @return {Response}
 */
export function borraComentario(Id) {
    return fetch(`${ENDPOINT}/comments/${Id}`,generateFetchConfig("DELETE")
    );
}


/**
 * Crea un Comentario
 * @method creaComentario
 * @param  {object}  payload new user payload
 * @return {Response}     Fetch Response object
 */
export function creaComentario(payload) {
    return fetch(`${ENDPOINT}/comments`,generateFetchConfig("POST", payload)
    );
}


/**
 * @method actualizaComentario
 * @param  {string} postId post's ID
 * @param  {string} userId user's ID
 * @return {Response}        Fetch Response
 */
export function actualizaComentario(Id) {
    // Create a new like for the user/post
    return fetch(`${ENDPOINT}/comments/${Id}`,generateFetchConfig("PUT", 
    { Id }));
}


/**
 * Fetch posts from the API
 * @method fetchPosts
 * @param  {string}   endpoint URL provided by Redux; the API will yield further endpoints we can access via the Link Header (https://www.w3.org/wiki/LinkHeader)
 * @return {Response}          Fetch API Response
 */
export function fetchPosts(endpoint) {
    return fetch(endpoint);
}