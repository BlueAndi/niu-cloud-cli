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

/** Command line argument handling */
import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import createToken from "./src/createToken.js"
import getVehicles from "./src/getVehicles.js"
import getVehiclePos from "./src/getVehiclePos.js"
import getBatteryInfo from "./src/getBatteryInfo.js"
import getBatteryHealth from "./src/getBatteryHealth.js"
import getBatteryChart from "./src/getBatteryChart.js"
import getBatteryChartRaw from "./src/getBatteryChartRaw.js"
import getTracks from "./src/getTracks.js"
import getTrackDetail from "./src/getTrackDetail.js"
import getFirmwareVersion from "./src/getFirmwareVersion.js"
import getUpdateInfo from "./src/getUpdateInfo.js"
import getMotorInfo from "./src/getMotorInfo.js"

yargs(hideBin(process.argv)).usage("Usage: $0 <command> [options]")
    .command(createToken)
    .command(getVehicles)
    .command(getVehiclePos)
    .command(getBatteryInfo)
    .command(getBatteryHealth)
    .command(getBatteryChart)
    .command(getBatteryChartRaw)
    .command(getTracks)
    .command(getTrackDetail)
    .command(getFirmwareVersion)
    .command(getUpdateInfo)
    .command(getMotorInfo)
    .demandCommand()
    .help("h")
    .alias("h", "help")
    .showHelpOnFail(true)
    .epilog("Copyright 2019 - 2023 Andreas Merkle <web@blue-andi.de>")
    .argv;
