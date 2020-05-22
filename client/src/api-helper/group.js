/*
 * Aux functions for groups
 */

import {server_add, init_params_get} from "./config";

export default class GroupFunc {
    static async createGroup(group_name, description, visible) {
        const query_url = server_add + "/api/group/create";
        const new_group = {
            "groupName": group_name,
            "description": description,
            "visible": visible
        };
        const post_params = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(new_group)
        };
        const response = await fetch(query_url, post_params);
        if (response.status === 409) {
            throw Error("Error: group name already taken");
        } else if (response.status === 500) {
            throw Error("Error: Server Error");
        } else if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }

        return await response.json();
    }

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

    static async changeGroup(group_name, key, content) {
        const query_url = server_add + "/api/group/"+ group_name + "/change/" + key;
        let req_body_dict = {};
        req_body_dict[key] = content;
        const post_params = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(req_body_dict)
        };

        const response = await fetch(query_url, post_params);
        if (response.status === 404) {
            throw Error("Error: Group Not Found");
        } else if (response.status === 409) {
            throw Error("Error: Group Name taken");
        } else if (response.status !== 200) {
            throw Error("Error: " + await response.text());
        }

        return await response.json();
    }

}