/*
 * Aux functions for pitch
 *
 * Usage:
 * Header Area:
 * import UserFunc from "./api-helper/pitch";
 *
 * When you use it:
 * let result = UserFunc.getRecordings("1", "2019-11-21T02:25:42.123Z", "2019-12-31T02:25:42.123Z")
 *
 * TODO: include query domain in a config file.
 */

import {server_add, init_params_get} from "./config";
import UserFunc from "./user";

export class RecordingFunc {
    static nthDayAgo(days) {
        let date_old = new Date();
        date_old.setDate(date_old.getDate() - days);
        return date_old;
    }

    static async getAllRecording(username) {
        if (username === null) {
            username = await UserFunc.getCurrentUsername();
        }
        const query_url = server_add + "/api/user/" + username + "/recordings";
        const response = await fetch(query_url, init_params_get);

        // Error Handling
        // TODO: Are there any other way to return this error message? RangeError?
        if (response.status === 404) {
            throw Error("Error: User Not Found");
        } else if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }

        const recordings = await response.json();
        recordings.forEach(element => {
            element['startTime'] = Date.parse(element['startTime']);
            element['endTime'] = Date.parse(element['endTime']);
        });
        return recordings;
    }

    // Get Recordings of User:
    // To get the recordings of a user between a time range
    // GET /api/user/{username}/recordings
    // checked runtime error if user not found, parsing failed etc
    static async getRecordings(username, start_time, end_time){
        return await this.filterRecordings(await this.getAllRecording(username), start_time, end_time);
    }

    static async filterRecordings(result, start_time, end_time) {
        return result.filter(one_item => one_item["startTime"] > start_time && one_item["endTime"] < end_time);
    }

    // Get Recordings of User:
    // To get the recordings of a user between a time range
    // GET /api/user/{username}/recordings?low=<lowBound>&high=<highBound>
    // checked runtime error if user not found, parsing failed etc
    static async getRecordings_new(username, start_time, end_time){
        const query_url = server_add + "/api/user/" + username +
            "/recordings?low=" + start_time.toISOString() + "&high=" + end_time.toISOString();
        const response = await fetch(query_url, init_params_get);

        // Error Handling
        // TODO: Are there any other way to return this error message? RangeError?
        if (response.status === 404) {
            throw Error("Error: User Not Found");
        } else if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }

        // Json Parsing
        const recordings = await response.json();
        recordings.forEach(element => {
            element['startTime'] = Date.parse(element['startTime']);
            element['endTime'] = Date.parse(element['endTime']);
        });
        return recordings;
    }

    // getPitchTotalCount:
    // To get the total count of pitches for a specific user in a specific time period
    // Calls getRecordings.
    // GET /api/user/{username}/recordings?low=<lowBound>&high=<highBound>
    // checked runtime error if user not found, parsing failed etc
    static async getPitchTotalCount(username, start_time, end_time){
        const recording_list = await this.getRecordings(username, start_time, end_time);
        let pitch_sum = 0;

        // TODO: error handling
        //recording_list.forEach(recording => pitch_sum += recording.numPitches);
        for (const recording of recording_list) {
            pitch_sum += recording.numPitches;
        }
        return pitch_sum;
    }

    /*
    {
        "username": foobar,
        "numPitches": 125,
        "instrument": "guitar",
        "description": "First round of practice!",
        "startTime": "2019-11-21T02:25:42.123Z",
        "endTime": "2019-11-21T02:29:15.396Z",
        "createdAt": "2019-11-21T02:29:16.025Z",
        "updatedAt": "2019-11-21T02:29:16.025Z"
    }
     */
    static async newRecording(numPitches, instrument, description, startTime, endTime) {
        const currentUserName = await UserFunc.getCurrentUsername();
        const query_url = server_add + "/api/recording/create";
        const new_recording = {
            "username": currentUserName,
            "numPitches": numPitches,
            "instrument": instrument,
            "description": description,
            "startTime": startTime.toISOString(),
            "endTime": endTime.toISOString()
        };

        const post_params = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(new_recording)
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

export default RecordingFunc;
