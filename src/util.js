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
var fs = require("fs");

/**
 * Utility functionality
 * @namespace
 */
var util = {};

module.exports = util;

/**
 * Resolve an object path and return value.
 * 
 * @param {string}  path    - Object path.
 * @param {object}  obj     - Object.
 * 
 * @returns {*} Value.
 */
util.resolve = function(path, obj) {

    return path.split(".").reduce(function(prev, curr) {
        return prev ? prev[curr] : null;
    }, obj);
};

/**
 * Filter object and return the values separated by ";".
 * 
 * @param {object}              obj     - Object.
 * @param {string | string[]}   filter  - A single filter or a filter array.
 * 
 * @returns {string} Values.
 */
util.filter = function(obj, filter) {
    var result      = "";
    var index       = 0;
    var separator   = ";";

    if (true === Array.isArray(filter)) {

        for(index = 0; index < filter.length; ++index) {

            if (0 < index) {
                result += separator;
            }

            result += util.resolve(filter[index], obj);
        }

    } else {

        result = util.resolve(filter, obj);
    }

    return result;
};

/**
 * Save data to a file with the given filename.
 * 
 * @param {string}  filename    - Name of the file.
 * @param {string}  data        - Data which to store.
 * 
 * @returns {Promise} Nothing.
 */
util.saveFile = function(filename, data) {

    return new Promise(function(resolve, reject) {

        fs.writeFile(
            filename,
            data,
            "utf8",
            function(err) {
                if (err) {
                    reject();
                } else {
                    resolve();
                }
            }
        );    

    });
};

/**
 * Load data from a file with the given filename.
 * 
 * @param {string}  filename    - Name of the file.
 * 
 * @returns {Promise} Loaded data as string.
 */
util.loadFile = function(filename) {

    return new Promise(function(resolve, reject) {

        fs.readFile(
            filename,
            "utf-8",
            function(err, data) {

                if (err) {
                    reject();
                } else {
                    resolve(data);
                }
            }
        );

    });
};
