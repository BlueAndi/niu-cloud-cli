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

exports.command = "get-vehicles";

exports.describe = "Get vehicles.";

exports.builder = {
    token: {
        describe: "Token",
        type: "string",
        demand: true
    },
    json: {
        describe: "Output result in JSON format.",
        type: "boolean",
        default: false
    }
};

exports.handler = function(argv) {
    var client = new niuCloudConnector.Client();

    client.setSessionToken({

        token: argv.token

    }).then(function(result) {

        return result.client.getVehicles();

    }).then(function(result) {

        var vehicleIndex    = 0;
        var vehicles        = result.result.data;
        var vehicle         = null;

        if (true === argv.json) {

            console.log(JSON.stringify(vehicles, null, 2));

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

        if ("string" === typeof err.error.message) {
            
            console.log("Error: ", err.error.message);

        } else if ("string" === typeof err.error.trace) {

            console.log("Error: ", err.error.trace);
        }

    });

    return;
};
