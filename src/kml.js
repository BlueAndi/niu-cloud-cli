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

/**
 * KML functionality
 * @namespace
 */
var kml = {};

module.exports = kml;

/**
 * Convert a value in degree to radian.
 * 
 * @private
 * 
 * @param {number} n    - Value in degree.
 * 
 * @returns {number} Value in radians.
 */
function radians(n) {
    return n * (Math.PI / 180);
}

/**
 * Convert a value in radian to degree.
 * 
 * @private
 * 
 * @param {number} n    - Value in radian.
 * 
 * @returns {number} Value in degree.
 */
function degrees(n) {
    return n * (180 / Math.PI);
}

/**
 * Calculate bearing from two GPS points.
 * 
 * @private
 * 
 * @param {number} startLat     - Start latitude in decimal degree.
 * @param {number} startLong    - Start longitude in decimal degree.
 * @param {number} endLat       - End latitude in decimal degree.
 * @param {number} endLong      - End longitude in decimal degree.
 * 
 * @returns {number} Bearing [0; 360[ degree.
 */
function getBearing(startLat, startLong, endLat, endLong) {
    startLat    = radians(startLat);
    startLong   = radians(startLong);
    endLat      = radians(endLat);
    endLong     = radians(endLong);

    var dLong = endLong - startLong;

    var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));

    if (Math.abs(dLong) > Math.PI) {
        if (dLong > 0.0) {
            dLong = -(2.0 * Math.PI - dLong);
        } else {
            dLong = (2.0 * Math.PI + dLong);
        }
    }

    return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
}

/**
 * Indent a string with the given number of spaces.
 * 
 * @param {string}  str     - String to indent.
 * @param {number}  indent  - Number of spaces.
 * 
 * @returns {string} Indented string.
 */
function indentStr(str, indent) {
    var index   = 0;
    var result  = "";

    for(index = 0; index < indent; ++index) {
        result += " ";
    }

    result += str;

    return result;
}

/**
 * Generate a KML file string from a single position.
 * 
 * @param {Object}  options                         - Options.
 * @param {Object}  options.position                - Position.
 * @param {string}  options.position.name           - Position name.
 * @param {string}  options.position.description    - Position description.
 * @param {number}  options.position.latitude       - Latitude in WGS84 format.
 * @param {number}  options.position.longitude      - Longitude in WGS84 format.
 * 
 * @returns {string} KML file as string.
 */
kml.generate = function(options) {
    var data        = "";
    var lineEnding  = "\r\n";
    var indent      = 4;
    var lineIndent  = 0;

    if ("object" !== typeof options) {
        return "";
    }

    if ("object" !== typeof options.position) {
        return "";
    }

    if (("string" !== typeof options.position.name) ||
        ("string" !== typeof options.position.description) ||
        ("number" !== typeof options.position.latitude) ||
        ("number" !== typeof options.position.longitude))
    {
        return "";
    }

    /* KML header */
    data  = indentStr("<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + lineEnding, lineIndent);
    /* KML namespace declaration */
    data += indentStr("<kml xmlns=\"http://www.opengis.net/kml/2.2\">" + lineEnding, lineIndent);
    lineIndent += indent;
    /* KML document */
    data += indentStr("<Document>" + lineEnding, lineIndent);
    lineIndent += indent;

    data += indentStr("<Placemark>" + lineEnding, lineIndent);
    lineIndent += indent;
    data += indentStr("<name>" + options.position.name + "</name>" + lineEnding, lineIndent);
    data += indentStr("<description>" + options.position.description + "</description>" + lineEnding, lineIndent);
    data += indentStr("<Point>" + lineEnding, lineIndent);
    lineIndent += indent;
    data += indentStr("<coordinates>" + options.position.longitude + "," + options.position.latitude + "</coordinates>" + lineEnding, lineIndent);
    lineIndent -= indent;
    data += indentStr("</Point>" + lineEnding, lineIndent);
    lineIndent -= indent;
    data += indentStr("</Placemark>" + lineEnding, lineIndent);

    lineIndent -= indent;
    data += indentStr("</Document>" + lineEnding, lineIndent);
    lineIndent -= indent;
    data += indentStr("</kml>" + lineEnding, lineIndent);

    return data;
};

/**
 * Generate a KML file string from a track.
 * 
 * @param {Object[]}    trackItems              - Track items.
 * @param {string}      trackItems.name         - Position name.
 * @param {string}      trackItems.description  - Position description.
 * @param {number}      trackItems.latitude     - Latitude in WGS84 format.
 * @param {number}      trackItems.longitude    - Longitude in WGS84 format.
 * 
 * @returns {string} KML file as string.
 */
kml.generateTrack = function(trackItems) {
    var data        = "";
    var lineEnding  = "\r\n";
    var indent      = 4;
    var lineIndent  = 0;
    var index       = 0;
    var urlStyle    = "";
    var bearing     = 0;

    if (false === Array.isArray(trackItems)) {
        return "";
    }

    /* KML header */
    data  = indentStr("<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + lineEnding, lineIndent);
    /* KML namespace declaration */
    data += indentStr("<kml xmlns=\"http://www.opengis.net/kml/2.2\">" + lineEnding, lineIndent);
    lineIndent += indent;
    /* KML document */
    data += indentStr("<Document>" + lineEnding, lineIndent);
    lineIndent += indent;
    /* Style */
    data += indentStr("<Style id=\"normalPlacemark\">" + lineEnding, lineIndent);
    lineIndent += indent;
    data += indentStr("<IconStyle>" + lineEnding, lineIndent);
    lineIndent += indent;
    data += indentStr("<Icon>" + lineEnding, lineIndent);
    lineIndent += indent;
    data += indentStr("<href>http://earth.google.com/images/kml-icons/track-directional/track-none.png</href>" + lineEnding, lineIndent);
    lineIndent -= indent;
    data += indentStr("</Icon>" + lineEnding, lineIndent);
    lineIndent -= indent;
    data += indentStr("</IconStyle>" + lineEnding, lineIndent);
    lineIndent -= indent;
    data += indentStr("</Style>" + lineEnding, lineIndent);
    lineIndent -= indent;

    for(index = 0; index < 16; ++index) {
        data += indentStr("<Style id=\"bearing" + index + "\">" + lineEnding, lineIndent);
        lineIndent += indent;
        data += indentStr("<IconStyle>" + lineEnding, lineIndent);
        lineIndent += indent;
        data += indentStr("<Icon>" + lineEnding, lineIndent);
        lineIndent += indent;
        data += indentStr("<href>http://earth.google.com/images/kml-icons/track-directional/track-" + index + ".png</href>" + lineEnding, lineIndent);
        data += indentStr("</Icon>" + lineEnding, lineIndent);
        lineIndent -= indent;
        data += indentStr("</IconStyle>" + lineEnding, lineIndent);
        lineIndent -= indent;
        data += indentStr("</Style>" + lineEnding, lineIndent);
        lineIndent -= indent;
    }

    for(index = 0; index < trackItems.length; ++index) {

        /* Last item? */
        if (trackItems.length == (index + 1)) {

            urlStyle = "#normalPlacemark";

        } else {

            /* Calculate bearing to the next track item */
            bearing = getBearing(trackItems[index].latitude, trackItems[index].longitude, trackItems[index + 1].latitude, trackItems[index + 1].longitude);

            /* Choose the right arrow icon, which represents the bearing. */
            urlStyle = "#bearing" + (Math.ceil(bearing / 22.5) % 16);
        }

        data += indentStr("<Placemark>" + lineEnding, lineIndent);
        lineIndent += indent;
        data += indentStr("<name>" + trackItems[index].name + "</name>" + lineEnding, lineIndent);
        data += indentStr("<description>" + trackItems[index].description + "</description>" + lineEnding, lineIndent);
        data += indentStr("<Point>" + lineEnding, lineIndent);
        lineIndent += indent;
        data += indentStr("<coordinates>" + trackItems[index].longitude + "," + trackItems[index].latitude + "</coordinates>" + lineEnding, lineIndent);
        lineIndent -= indent;
        data += indentStr("</Point>" + lineEnding, lineIndent);
        lineIndent -= indent;
        data += indentStr("<styleUrl>" + urlStyle + "</styleUrl>" + lineEnding, lineIndent);
        data += indentStr("</Placemark>" + lineEnding, lineIndent);
    }

    lineIndent -= indent;
    data += indentStr("</Document>" + lineEnding, lineIndent);
    lineIndent -= indent;
    data += indentStr("</kml>" + lineEnding, lineIndent);

    return data;
};
