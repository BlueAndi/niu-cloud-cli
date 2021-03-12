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

exports.command = "create-token <account> <password> <countryCode>";

exports.describe = "Create a session token.";

exports.builder = {
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
    }
};

exports.handler = function(argv) {
    var client = new niuCloudConnector.Client();

    client.createSessionToken({

        account: argv.account,
        password: argv.password,
        countryCode: argv.countryCode

    }).then(function(result) {

        console.log(result.result);

    }).catch(function(err) {

        console.log("Error: ", err.error.message);

    });

    return;
};
