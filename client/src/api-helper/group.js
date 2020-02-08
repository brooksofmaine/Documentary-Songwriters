/*
 * Aux functions for groups
 */

import {server_add, init_params_get} from "./config";

export default class GroupFunc {
    static async getGroup(group_name) {
        const query_url = server_add + "/api/group/"+ group_name;
        const response = await fetch(query_url, init_params_get);
        if (response.status === 404) {
            throw Error("Error: User Not Found");
        } else if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }
        return await response.json();
    }

    // TODO: distinguish group and user not found
    static async addMember(group_name, member) {
        const query_url = server_add + "/api/group/"+ group_name + "/add";
        const new_user_name = {
            "username": member
        };
        const post_params = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(new_user_name)
        };

        const response = await fetch(query_url, post_params);
        if (response.status === 404) {
            throw Error("Error: User or Group Not Found");
        } else if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }

        return await response.json();
    }

    // TODO: distinguish group and user not found
    static async deleteMember(group_name, member) {
        const query_url = server_add + "/api/group/"+ group_name + "/delete";
        const new_user_name = {
            "username": member
        };
        const post_params = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(new_user_name)
        };

        const response = await fetch(query_url, post_params);
        if (response.status === 404) {
            throw Error("Error: User or Group Not Found");
        } else if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }

        return await response.json();
    }
}