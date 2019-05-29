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

exports.command = "get-update-info";

exports.describe = "Get vehicle update information.";

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

        return result.client.getUpdateInfo({
            sn: argv.sn
        });

    }).then(function(result) {

        var updateInfo = result.result.data;

        if (true === argv.json) {

            console.log(JSON.stringify(updateInfo, null, 2));

        } else if ("undefined" !== typeof argv.filter) {

            console.log(util.filter(updateInfo, argv.filter));

        } else {

            console.log("CSQ                   : " + updateInfo.csq);
            console.log("Centre control battery: " + updateInfo.centreCtrlBattery);
            console.log("Date                  : " + new Date(updateInfo.date).toLocaleString());

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
