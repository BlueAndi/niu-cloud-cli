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

exports.command = "get-firmware-version";

exports.describe = "Get vehicle firmware version.";

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
    }
};

exports.handler = function(argv) {
    var client = new niuCloudConnector.Client();

    client.setSessionToken({

        token: argv.token

    }).then(function(result) {

        return result.client.getFirmwareVersion({
            sn: argv.sn
        });

    }).then(function(result) {

        var firmwareData    = result.result.data;
        var firmwareDate    = new Date(firmwareData.date);

        if (true === argv.json) {

            console.log(JSON.stringify(firmwareData, null, 2));

        } else {

            console.log("Now version        : " + firmwareData.nowVersion);
            console.log("Version            : " + firmwareData.version);
            console.log("Hard version       : " + firmwareData.hardVersion);
            console.log("SS protocol version: " + firmwareData.ss_protocol_ver);
            console.log("Byte size          : " + firmwareData.byteSize);
            console.log("Date               : " + firmwareDate.toLocaleString());
            console.log("Is support update? : " + firmwareData.isSupportUpdate);
            console.log("Is update needed?  : " + firmwareData.needUpdate);
            console.log("OTA description    : " + firmwareData.otaDescribe);

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
