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

/** Command line argument handling */
const yargs = require("yargs");

yargs.usage("Usage: $0 <command> [options]")
    .command(require("./src/createToken"))
    .command(require("./src/getVehicles"))
    .command(require("./src/getVehiclePos"))
    .command(require("./src/getBatteryInfo"))
    .command(require("./src/getBatteryHealth"))
    .command(require("./src/getBatteryChart"))
    .command(require("./src/getBatteryChartRaw"))
    .command(require("./src/getTracks"))
    .command(require("./src/getTrackDetail"))
    .command(require("./src/getFirmwareVersion"))
    .command(require("./src/getUpdateInfo"))
    .command(require("./src/getMotorInfo"))
    .demandCommand()
    .help("h")
    .alias("h", "help")
    .showHelpOnFail(true)
    .epilog("Copyright 2019-2021 by Andreas Merkle <web@blue-andi.de>")
    .argv;
