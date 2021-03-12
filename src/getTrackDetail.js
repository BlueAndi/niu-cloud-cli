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

exports.command = "get-track-detail";

exports.describe = "Get track detail.";

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
    trackId: {
        describe: "Track id",
        type: "string",
        demand: true
    },
    trackDate: {
        describe: "Track date",
        type: "string",
        demand: true
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

        return result.client.getTrackDetail({
            sn: argv.sn,
            trackId: argv.trackId,
            trackDate: argv.trackDate
        });

    }).then(function(result) {

        var trackDetail     = result.result;
        var trackItems      = trackDetail.trackItems;
        var trackItem       = null;
        var index           = 0;
        var trackData       = [];
        var itemDate        = null;
        var itemDatePrev    = null;
        var dTime           = 0;
        var dTimeStr        = "-";
        var description     = "";

        if (true === argv.json) {

            console.log(JSON.stringify(trackDetail, null, 2));

        } else if (true === argv.kml) {

            for(index = 0; index < trackItems.length; ++index) {

                /* The track items are in reverse order, which means the first item
                 * contains the end of the track.
                 */
                trackItem = trackItems[trackItems.length - index - 1];

                /* Get track item date */
                itemDate = new Date(parseInt(trackItem.date));

                /* Calculate time difference from the previous item to the current one. */
                if (0 == index) {
                    dTimeStr = "-";
                } else {
                    itemDatePrev    = new Date(parseInt(trackItems[trackItems.length - index].date));
                    dTime           = itemDate.getHours() * 60 * 60 + itemDate.getMinutes() * 60 + itemDate.getSeconds();
                    dTime          -= itemDatePrev.getHours() * 60 * 60 + itemDatePrev.getMinutes() * 60 + itemDatePrev.getSeconds();
                    dTimeStr        = Math.ceil(dTime).toString() + " seconds";
                }

                description  = "Date: " + itemDate.toLocaleString() + "\r\n";
                description += "dTime: " + dTimeStr;

                trackData.push({
                    name: "#" + (index + 1),
                    description: description,
                    latitude: trackItem.lat,
                    longitude: trackItem.lng
                });
            }

            console.log(kml.generateTrack(trackData));

        } else {

            console.log("Track \"" + argv.trackId + "\" detail from " + argv.trackDate);

            for(index = 0; index < trackItems.length; ++index) {
        
                console.log("\tItem #" + (index + 1));
                console.log("\t\tLongitude: " + trackItems[index].lng);
                console.log("\t\tLatitude: " + trackItems[index].lat);
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
