/*
 * Aux functions for pitch
 *
 * Usage:
 * Header Area:
 * import {getRecordings} from "./api-helper/pitch";
 *
 * When you use it:
 * let result = getRecordings("1", "2019-11-21T02:25:42.123Z", "2019-12-31T02:25:42.123Z")
 *
 * TODO: include query domain in a config file.
 */


const init_params_get = {
    method: 'get',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include'
};
const server_add = "http://localhost:5000";


// Get Recordings of User:
// To get the recordings of a user between a time range
// GET /api/user/{username}/recordings?low=<lowBound>&high=<highBound>
// checked runtime error if user not found, parsing failed etc
export async function getRecordings(username, start_time, end_time){
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
    const myJson = await response.json();
    console.log(JSON.stringify(myJson));
    return JSON.stringify(myJson);
}


// getPitchTotalCount:
// To get the total count of pitches for a specific user in a specific time period
// Calls getRecordings.
// GET /api/user/{username}/recordings?low=<lowBound>&high=<highBound>
// checked runtime error if user not found, parsing failed etc
export async function getPitchTotalCount(username, start_time, end_time){
    const recording_list = await this.getRecordings(username, start_time, end_time);
    let pitch_sum = 0;
    // TODO: error handling
    for (const recording of recording_list) {
        pitch_sum += recording["numPitches"];
    }
    return pitch_sum;
}



