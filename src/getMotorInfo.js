/* MIT License
 *
 * Copyright (c) 2019 Andreas Merkle <web@blue-andi.de>
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

exports.command = "get-motor-info";

exports.describe = "Get motor information.";

exports.builder = {
    token: {
        describe: "Token",
        type: "string",
        demand: true
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
    }
};

exports.handler = function(argv) {
    var client = new niuCloudConnector.Client();

    /* Only --json or --filter is possible. */
    if ((true === argv.json) &&
        ("undefined" !== typeof argv.filter))
    {
        console.log("Only --json or --filter is possible.");
        return;
    }
    
    client.setSessionToken({

        token: argv.token

    }).then(function(result) {

        return result.client.getMotorInfo({
            sn: argv.sn
        });

    }).then(function(result) {

        var motorInfo       = result.result.data;
        var index           = 0;
        var compartment     = null;
        var batteryCnt      = 1;

        if (true === argv.json) {

            console.log(JSON.stringify(motorInfo, null, 2));

        } else if ("undefined" !== typeof argv.filter) {

            console.log(util.filter(motorInfo, argv.filter));

        } else {

            console.log("Is charging                     : " + motorInfo.isCharging);
            console.log("Lock status                     : " + motorInfo.lockStatus);
            console.log("Is adaptive cruise control on   : " + motorInfo.isAccOn);
            console.log("Is fortification on             : " + motorInfo.isFortificationOn);
            console.log("Is connected                    : " + motorInfo.isConnected);
            console.log("Current position                : ");
            console.log("\tLatitude : " + motorInfo.postion.lat);
            console.log("\tLongitude: " + motorInfo.postion.lng);
            console.log("Horizontal dilution of precision: " + motorInfo.hdop);
            console.log("Time                            : " + new Date(motorInfo.time).toLocaleString());

            if ("object" === typeof motorInfo.batteries.compartmentB)
            {
                ++batteryCnt;
            }

            for(index = 0; index < batteryCnt; ++index) {

                if (0 === index) {
                    console.log("Battery A                       :");
                    compartment = motorInfo.batteries.compartmentA;
                } else {
                    console.log("Battery B                       :");
                    compartment = motorInfo.batteries.compartmentB;
                }

                console.log("\tBMS id         : " + compartment.bmsId);
                console.log("\tIs connected   : " + compartment.isConnected);
                console.log("\tState of charge: " + compartment.batteryCharging + " %");
                console.log("\tGrade          : " + compartment.gradeBattery);
            }

            console.log("Left time                       : " + motorInfo.leftTime);
            console.log("Estimated mileage               : " + motorInfo.estimatedMileage + " km");
            console.log("GPS timestamp                   : " + new Date(motorInfo.gpsTimestamp).toLocaleString());
            console.log("Info timestamp                  : " + new Date(motorInfo.infoTimestamp).toLocaleString());
            console.log("Current speed                   : " + motorInfo.nowSpeed + " km/h");
            console.log("Battery detail                  : " + motorInfo.batteryDetail);
            console.log("Centre control battery          : " + motorInfo.centreCtrlBattery);
            console.log("SS protocol version             : " + motorInfo.ss_protocol_ver);
            console.log("SS online status                : " + motorInfo.ss_online_sta);
            console.log("GPS signal strength             : " + motorInfo.gps);
            console.log("GSM signal strength             : " + motorInfo.gsm);
            console.log("Last track                      : ");
            console.log("\tRiding time: " + motorInfo.lastTrack.ridingTime + " s");
            console.log("\tDistance   : " + motorInfo.lastTrack.distance + " m");
            console.log("\tTime       : " + new Date(motorInfo.lastTrack.time).toLocaleString());
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
