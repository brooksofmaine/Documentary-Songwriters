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

export class RecordingFunc {
    // Get Recordings of User:
    // To get the recordings of a user between a time range
    // GET /api/user/{username}/recordings
    // checked runtime error if user not found, parsing failed etc
    static async getRecordings(username, start_time, end_time){
        const query_url = server_add + "/api/user/" + username + "/recordings";
        const response = await fetch(query_url, init_params_get);

        // Error Handling
        // TODO: Are there any other way to return this error message? RangeError?
        if (response.status === 404) {
            throw Error("Error: User Not Found");
        } else if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }

        // Json Parsing
        const result = await response.json();
        return await this.filterRecordings(result, start_time, end_time);
    }

    static async filterRecordings(result, start_time, end_time) {
        console.log(result);
        return result;
    }


    // Get Recordings of User:
    // To get the recordings of a user between a time range
    // GET /api/user/{username}/recordings?low=<lowBound>&high=<highBound>
    // checked runtime error if user not found, parsing failed etc
    static async getRecordings_new(username, start_time, end_time){
        const query_url = server_add + "/api/user/" + username +
            "/recordings?low=" + start_time + "&high=" + end_time;
        const response = await fetch(query_url, init_params_get);

        // Error Handling
        // TODO: Are there any other way to return this error message? RangeError?
        if (response.status === 404) {
            throw Error("Error: User Not Found");
        } else if (response.status !== 200) {
            throw Error("Error: Connection Error");
        }

        // Json Parsing
        return await response.json();
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
        for (const recording of recording_list) {
            pitch_sum += recording["numPitches"];
        }
        return pitch_sum;
    }

    static async newRecording(numPitches, instrument, description, startTime, endTime) {
        const query_url = server_add + "/api/recording/create";
        const new_recording = {
            "numPitches": numPitches,
            "instrument": instrument,
            "description": description,
            "startTime": startTime,
            "endTime": endTime
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
