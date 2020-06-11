/*
 * Server config file
 * not meant to be imported by client
 */

export const server_add = process.env.REACT_APP_SERVER_ADD || "http://localhost:5000";

export const init_params_get = {
    method: 'get',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include'
};