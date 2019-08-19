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

exports.command = "get-battery-chart";

exports.describe = "Get battery chart.";

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
    bmsId: {
        describe: "BMS id",
        type: "string",
        demand: true
    },
    page: {
        describe: "Page",
        type: "string",
        demand: true
    },
    pageSize: {
        describe: "Page size",
        type: "string",
        demand: true
    },
    pageLength: {
        describe: "Page length",
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

        return result.client.getBatteryChart({
            sn: argv.sn,
            bmsId: argv.bmsId,
            page: argv.page,
            pageSize: argv.pageSize,
            pageLength: argv.pageLength
        });

    }).then(function(result) {

        var batteryChart    = result.result.data;
        var index           = 0;

        if (true === argv.json) {

            console.log(JSON.stringify(batteryChart, null, 2));

        } else {

            console.log("\"mileage [km]\";\"Battery status [%]\"");

            if ("undefined" !== typeof batteryChart.items2) {

                for(index = 0; index < batteryChart.items2.length; ++index) {

                    console.log(parseInt(batteryChart.items2[index].m) + ";" + parseInt(batteryChart.items2[index].b));
                }
            }

            for(index = 0; index < batteryChart.items1.length; ++index) {

                console.log(parseInt(batteryChart.items1[index].m) + ";" + parseInt(batteryChart.items1[index].b));
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

    });

    return;
};
