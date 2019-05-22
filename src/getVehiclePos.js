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
const kml = require("./kml");

exports.command = "get-vehicle-pos";

exports.describe = "Get vehicle position.";

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
    kml: {
        describe: "Output result as KML file.",
        type: "boolean",
        default: false
    }
};

exports.handler = function(argv) {
    var client = new niuCloudConnector.Client();

    /* Only --json or --kml is possible. */
    if ((true === argv.json) &&
        (true === argv.kml))
    {
        console.log("Only --json or --kml is possible.");
        return;
    }

    client.setSessionToken({

        token: argv.token

    }).then(function(result) {

        return result.client.getVehiclePos({
            sn: argv.sn
        });

    }).then(function(result) {

        var vehiclePos  = result.result.data;
        var timeDate    = new Date(vehiclePos.timestamp);

        if (true === argv.json) {

            console.log(JSON.stringify(vehiclePos, null, 2));

        } else if (true === argv.kml) {

            console.log(kml.generate({
                position: {
                    name: argv.sn,
                    description: "Last known position from " + timeDate.toLocaleString(),
                    latitude: vehiclePos.lat,
                    longitude: vehiclePos.lng
                }
            }));

        } else {

            console.log("Latitude     : " + vehiclePos.lat);
            console.log("Longitude    : " + vehiclePos.lng);
            console.log("Timestamp    : " + timeDate.toLocaleString());
            console.log("GPS          : " + vehiclePos.gps);
            console.log("GPS precision: " + vehiclePos.gpsPrecision);

        }

    }).catch(function(err) {

        if ("string" === typeof err.error.message) {
            
            console.log("Error: ", err.error.message);

        } else if ("string" === typeof err.error.trace) {

            console.log("Error: ", err.error.trace);
        }

    });

    return;
};
