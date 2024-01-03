/* MIT License
 *
 * Copyright (c) 2019 - 2024 Andreas Merkle <web@blue-andi.de>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import niuCloudConnector from "../libs/niu-cloud-connector/index.js"
import util from "../src/util.js"
import errorCode from "../src/errorCode.js"

const command = "get-tracks";

const describe = "Get tracks.";

const builder = {
    token: {
        describe: "Token",
        type: "string",
        conflicts: "tokenFile"
    },
    sn: {
        describe: "Serial number",
        type: "string",
        demand: true
    },
    json: {
        describe: "Output result in JSON format.",
        type: "boolean",
        default: false
    },
    start: {
        describe: "Track start index (0..N)",
        type: "number",
        default: 0
    },
    num: {
        describe: "Number of tracks",
        type: "number",
        default: 10
    },
    tokenFile: {
        describe: "Load token from the file with the given filename",
        type: "string"
    },
    debug: {
        describe: "Use it for debugging purposes.",
        type: "boolean",
        default: false
    }
};

const handler = function(argv) {
    var client = new niuCloudConnector.Client();
    var promise = null;

    if (true === argv.debug) {
        client.enableDebugMode(true);
    }
    
    if (("string" === typeof argv.token) &&
        (0 < argv.token.length)) {
        promise = Promise.resolve({
            token: argv.token
        });
    } else if ("string" === typeof argv.tokenFile) {
        promise = util.loadFile(argv.tokenFile).then(function(rsp) {
            return Promise.resolve(JSON.parse(rsp));
        });
    } else {
        promise = Promise.reject("No token available.");
    }

    promise.then(function(result) {

        return client.setSessionToken({
            token: result.token
        });

    }).then(function(result) {

        return result.client.getTracks({
            sn: argv.sn,
            index: argv.start,
            pageSize: argv.num
        });

    }).then(function(result) {
        var tracks      = result.result.items;
        var track       = null;
        var index       = 0;
        var startTime   = null;
        var endTime     = null;

        if (null === tracks) {
            tracks = [];
        }

        if (true === argv.json) {

            console.log(JSON.stringify(tracks, null, 2));

        } else {

            for(index = 0; index < tracks.length; ++index) {
                track       = tracks[index];
                startTime   = new Date(track.startTime);
                endTime     = new Date(track.endTime);

                console.log("Track #" + (index + 1));
                console.log("\tTrack id        : " + track.trackId);
                console.log("\tTrack date      : " + track.date);
                console.log("\tTrack start time: " + startTime.toLocaleString());
                console.log("\tTrack end time  : " + endTime.toLocaleString());
                console.log("\tDistance        : " + track.distance + " m");
                console.log("\tAverage speed   : " + track.avespeed + " km/h");
                console.log("\tRiding time     : " + track.ridingtime + " min.");
                console.log("\tStart point     : ");
                console.log("\t\tLatitude : " + track.startPoint.lat);
                console.log("\t\tLongitude: " + track.startPoint.lng);
                console.log("\tEnd point       : ");
                console.log("\t\tLatitude : " + track.lastPoint.lat);
                console.log("\t\tLongitude: " + track.lastPoint.lng);
            }

        }

    }).catch(function(err) {

        if ("undefined" === typeof err.error) {

            console.log("Error: ", err);

        } else if ("string" === typeof err.error.message) {
            
            console.log("Error: ", err.error.message);

        } else if ("string" === typeof err.error.trace) {

            console.log("Error: ", err.error.trace);
        }

        yargs().exit(errorCode.FAILED);
    });

    return;
};

export default {
    command,
    describe,
    builder,
    handler
};
