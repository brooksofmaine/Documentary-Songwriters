/*
 * Aux functions for user
 *
 * Usage:
 * Header Area:
 * import {} from "./api-helper/user";
 *
 * When you use it:
 * let result =
 *
 * TODO: include query domain in a config file.
 */

import {server_add, init_params_get} from "./config";

export class UserFunc {
    async getCurrentUser () {
        const query_url = server_add + "/api/auth/loginstatus";
        const response = await fetch(query_url, init_params_get);
        if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }
        const myJson = await response.json();
        return JSON.stringify(myJson);
    }

    async getUserInfo (username) {
        const query_url = server_add + "/api/user/" + username;
        const response = await fetch(query_url, init_params_get);
        if (response.status === 404) {
            throw Error("Error: User Not Found");
        } else if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }
        const myJson = await response.json();
        return JSON.stringify(myJson);
    }
}
