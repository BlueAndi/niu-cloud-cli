/* MIT License
 *
 * Copyright (c) 2019 - 2023 Andreas Merkle <web@blue-andi.de>
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
import niuCloudConnector from "../libs/niu-cloud-connector"
import util from "../src/util.js"
import errorCode from "../src/errorCode.js"

const command = "get-battery-chart";

const describe = "Get battery chart.";

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
    battery: {
        describe: "Select battery \"A\" or \"B\"",
        type: "string",
        demand: true
    },
    pages: {
        describe: "Number of pages to get",
        type: "number",
        default: 0
    },
    json: {
        describe: "Output result in JSON format.",
        type: "boolean",
        default: false
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
    
    if (("A" !== argv.battery) &&
        ("B" !== argv.battery)) {

        console.log("Only \"A\" or \"B\" for battery are supported.");
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

        var bmsId       = ("A" === argv.battery) ? 1 : 2;
        var page        = 1;
        var pageSize    = "B";
        var pageLength  = 1;
        var data        = [];
        var pages       = argv.pages;

        return loop(result.client.getBatteryChart({
            sn: argv.sn,
            bmsId: bmsId,
            page: page,
            pageSize: pageSize,
            pageLength: pageLength
        }), function(par) {

            var nextPar = {
                done: false,
                value: null
            };

            data.unshift(...par.result.items1);

            if ((0 < argv.pages) &&
                (0 < pages)) {

                --pages;

            } else {

                pages = 1;
            }

            if ((0 < pages) &&
                (0 < par.result.items1.length)) {

                page += 1;

                nextPar.done = false;
                nextPar.value = result.client.getBatteryChart({
                    sn: argv.sn,
                    bmsId: bmsId,
                    page: page,
                    pageSize: pageSize,
                    pageLength: pageLength
                });

            } else {

                nextPar.done = true;
                nextPar.value = data;

            }

            return nextPar;
        });

    }).then(function(result) {

        var index = 0;

        if (true === argv.json) {

            console.log(JSON.stringify(result, null, 2));

        } else {

            console.log("\"Mileage [km]\";\"Battery status [%]\"");

            for(index = 0; index < result.length; ++index) {
    
                console.log(parseInt(result[index].m) + ";" + parseInt(result[index].b));
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

        yargs.exit(errorCode.FAILED);
    });

    return;
};

export default {
    command,
    describe,
    builder,
    handler
};

/**
 * Promise loop.
 * 
 * @param {Promise}     promise - A native promise.
 * @param {Function}    fn      - Result function.
 * 
 * @returns {Promise|Object} Depended on result function, a promise or the result value.
 */
function loop(promise, fn) {
    return promise.then(fn).then(function(wrapper) {
        return (false === wrapper.done) ? loop(wrapper.value, fn) : wrapper.value;
    });
}
