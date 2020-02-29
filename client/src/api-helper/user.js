/*
 * Aux functions for user
 *
 * Usage:
 *
 * Header Area:
 * import UserFunc from "./api-helper/user";
 *
 * When you use it:
 * let result = await UserFunc.getCurrentUser();
 * or
 * UserFunc.getCurrentUser().then(<callback function>);
 */

import {server_add, init_params_get} from "./config";

export default class UserFunc {
    /*
    {
        "status":"logged_in",
        "user":{"username":"123","email":"123","firstName":"123","lastName":"123"}
    }
     */
    static async getCurrentUser () {
        const query_url = server_add + "/api/auth/loginstatus";
        const response = await fetch(query_url, init_params_get);
        if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }
        return await response.json();
    }

    static async getCurrentUsername() {
        const userinfo = await this.getCurrentUser();
        if (userinfo['status'] !== "logged_in") {
            throw Error("Trying to add new recording while not logged in");
        }
        return userinfo["user"]["username"];
    }

    static async getUserInfo (username) {
        const query_url = server_add + "/api/user/" + username;
        const response = await fetch(query_url, init_params_get);
        if (response.status === 404) {
            throw Error("Error: User Not Found");
        } else if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }
        return await response.json();
    }
}
