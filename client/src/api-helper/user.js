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

// TODO: cache username??

import {server_add, init_params_get} from "./config";
import {RecordingFunc} from "./recording";

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
            throw Error("Trying to get username while user is not logged in");
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

    // function lastPlayedInstrument
    // input: username
    // output: the last played Instrument (if any)
    //         if no recent Instrument, return null.
    // note: assumes the list from the server is sorted by startDate or endDate, and decreasing.
    static async lastPlayedInstrument (username) {
        // TODO: server side should be able to return a limited amount of results for better performance.
        const all_recordings = await RecordingFunc.getAllRecording(username);
        if (all_recordings.length < 1) {
            return null;
        } else {
            return all_recordings[0].instrument;
        }
    }

    static async logUserOut() {
        const loginstatus = await this.getCurrentUser();
        if (loginstatus.status !== "logged_in") {
            throw Error("User is not logged in");
        }

        const query_url = server_add + "/api/auth/logout";
        const response = await fetch(query_url, init_params_get);
        if (response.status === 404) {
            throw Error("Error: User Not Found");
        } else if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }
        return response;
    }

    /*  * Valid keys for users are:
     * - username
     * - email
     * - firstName
     * - lastName
     * - weeklyAchievement
     * - LastPlayedInstrument
     */
    static async changeInfo(key, value) {
        const userinfo = await this.getCurrentUser();
        if (userinfo.status !== "logged_in") {
            throw Error("User is not logged in");
        }

        const username = userinfo["user"]["username"];
        let query_obj = {};
        query_obj[key] = value;
        const query_url = server_add + "/api/user/"+ username + "/change/" + key;
        const post_params = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(query_obj)
        };

        const response = await fetch(query_url, post_params);

        if (response.status === 404) {
            throw Error("Error: User Not Found");
        } else if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }
        return response;
    }

    static async getGroups(username) {
        const query_url = server_add + "/api/user/" + username + "/getGroups";
        const response = await fetch(query_url, init_params_get);
        if (response.status === 404) {
            throw Error("Error: User Not Found");
        } else if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }
        return await response.json();
    }
}
