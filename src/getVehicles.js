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
import yargs from "yargs";
import niuCloudConnector from "../libs/niu-cloud-connector/index.js"
import util from "../src/util.js"
import errorCode from "../src/errorCode.js"

const command = "get-vehicles";

const describe = "Get vehicles.";

const builder = {
    token: {
        describe: "Token",
        type: "string",
        conflicts: "tokenFile"
    },
    json: {
        describe: "Output result in JSON format.",
        type: "boolean",
        default: false
    },
    filter: {
        describe: "Output filter",
        type: "string"
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
    
    /* Only --json or --filter is possible. */
    if ((true === argv.json) &&
        ("undefined" !== typeof argv.filter))
    {
        console.log("Only --json or --filter is possible.");
        return;
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

        return result.client.getVehicles();

    }).then(function(result) {

        var vehicleIndex    = 0;
        var vehicles        = result.result;
        var vehicle         = null;

        if (true === argv.json) {

            console.log(JSON.stringify(vehicles, null, 2));

        } else if ("undefined" !== typeof argv.filter) {

            console.log(util.filter(vehicles, argv.filter));

        } else {

            if (0 === vehicles.length) {

                console.log("No vehicles available.");

            } else {

                for(vehicleIndex = 0; vehicleIndex < vehicles.length; ++vehicleIndex) {
    
                    vehicle = vehicles[vehicleIndex];
        
                    console.log((vehicleIndex + 1) + ". " + vehicle.type);
                    console.log("\tName         : " + vehicle.name);
                    console.log("\tSerial number: " + vehicle.sn);
                    console.log("\tFrame number : " + vehicle.frameNo);
                    console.log("\tEngine number: " + vehicle.engineNo);
                }

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
