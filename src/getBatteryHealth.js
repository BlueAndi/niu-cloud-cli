/* MIT License
 *
 * Copyright (c) 2019-2021 Andreas Merkle <web@blue-andi.de>
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
const niuCloudConnector = require("../libs/niu-cloud-connector");
const util = require("./util");

exports.command = "get-battery-health";

exports.describe = "Get battery health.";

exports.builder = {
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

exports.handler = function(argv) {
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

        return result.client.getBatteryHealth({
            sn: argv.sn
        });

    }).then(function(result) {

        var batteryHealth   = result.result;
        var index           = 0;
        var compartment     = null;
        var batteryCnt      = 1;
        var healthRecIndex  = 0;
        var healthRecords   = null;

        if (true === argv.json) {

            console.log(JSON.stringify(batteryHealth, null, 2));

        } else if ("undefined" !== typeof argv.filter) {

            console.log(util.filter(batteryHealth, argv.filter));

        } else {

            if ("object" === typeof batteryHealth.batteries.compartmentB)
            {
                ++batteryCnt;
            }

            for(index = 0; index < batteryCnt; ++index) {
                if (0 === index) {
                    console.log("Battery A        :");
                    compartment = batteryHealth.batteries.compartmentA;
                } else {
                    console.log("Battery B        :");
                    compartment = batteryHealth.batteries.compartmentB;
                }

                console.log("\tBMS id         : " + compartment.bmsId);
                console.log("\tIs connected   : " + compartment.isConnected);
                console.log("\tGrade          : " + compartment.gradeBattery);
                console.log("\tHealth records : ");

                healthRecords = compartment.healthRecords;
                for(healthRecIndex = 0; healthRecIndex < healthRecords.length; ++healthRecIndex) {

                    console.log("\t\tResult      : " + healthRecords[healthRecIndex].result);
                    console.log("\t\tCharge count: " + healthRecords[healthRecIndex].chargeCount);
                    console.log("\t\tColor       : " + healthRecords[healthRecIndex].color);
                    console.log("\t\tTime        : " + new Date(healthRecords[healthRecIndex].time).toLocaleString());
                    console.log("\t\tName        : " + healthRecords[healthRecIndex].name);
                }
            }

            console.log("Is double battery: " + batteryHealth.isDoubleBattery);
        }

    }).catch(function(err) {

        if ("undefined" === typeof err.error) {

            console.log("Error: ", err);

        } else if ("string" === typeof err.error.message) {
            
            console.log("Error: ", err.error.message);

        } else if ("string" === typeof err.error.trace) {

            console.log("Error: ", err.error.trace);
        }

    });

    return;
};
