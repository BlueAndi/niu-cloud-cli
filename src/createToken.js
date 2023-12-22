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

const command = "create-token <account> <password> <countryCode>";

const describe = "Create a session token.";

const builder = {
    account: {
        describe: "Your user name or email address.",
        string: true
    },
    password: {
        describe: "Your user password.",
        string: true
    },
    countryCode: {
        describe: "Your country code, e.g. 49 for germany.",
        string: true
    },
    tokenFile: {
        describe: "A filename where the token will be stored. If the file exists, it will be overwritten.",
        type: "string",
        default: ""
    }
};

const handler = function(argv) {
    var client = new niuCloudConnector.Client();

    client.createSessionToken({

        account: argv.account,
        password: argv.password,
        countryCode: argv.countryCode

    }).then(function(result) {
        var jsonToken = null;
        var promise = null;

        if ("" === argv.tokenFile) {
            promise = Promise.resolve(result.result);
        } else {

            jsonToken = {
                token: result.result
            };

            promise = util.saveFile(argv.tokenFile, JSON.stringify(jsonToken, null, 2)).then(function() {
                return Promise.resolve("Complete.");
            }).catch(function() {
                return Promise.reject("Failed to store token.");
            });
        }

        return promise;

    }).then(function(rsp) {

        console.log(rsp);

    }).catch(function(err) {

        if ("string" === typeof err) {
            console.log("Error: " + err);
        } else if ("object" === typeof err) {

            if ("object" === typeof err.error) {
                console.log("Error: ", err.error.message);
            } else {
                console.log("Internal error.");
            }
        } else {
            console.log("Internal error.");
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
