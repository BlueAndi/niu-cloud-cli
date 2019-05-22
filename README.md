# niu-cloud-cli
Access the NIU cloud via command line interface. It is based on the [niu-cloud-connector](https://github.com/BlueAndi/niu-cloud-connector).

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://choosealicense.com/licenses/mit/)

A project originated from an [article in the Elektroroller-Forum](https://www.elektroroller-forum.de/viewtopic.php?f=63&t=6227) [German].

## Installation

The niu-cloud-connector libray is included as git submodule. Therefore the "--recursive" option is important, because otherwise the niu-cloud-connector is not included.

```
$ git clone --recursive https://github.com/BlueAndi/niu-cloud-cli.git
$ cd niu-cloud-cli
$ npm install
```

## Show all commands and parameters

```
node niu-cloud-cli.js --help
```

## Example

First create a session token with your NIU cloud account. This token is necessary for all further requests.

```
node niu-cloud-cli.js create-token <account> <password> <country-code>
```

Get a list of your vehicles. Each vehicle has a serial number, which is necessary to get vehicle specific informations.

```
node niu-cloud-cli.js get-vehicles --token <token>
```

## KML output for google earth or google maps

### Last known position

Generate a KML file including the last known position of your NIU e-scooter with the following call:

```
node niu-cloud-cli.js get-vehicle-pos --token <token> --sn <serial-number> --kml > pos.kml
```

Load the generated pos.kml file in google earth or google map.

### Track detail

First get e.g. the last recorded track.

```
node niu-cloud-cli.js get-tracks --token <token> --sn <serial-number> --num 1
```
```
Track #1
        Track id        : 1558023845684dBO79fv:1
        Track date      : 20190516
        Track start time: 2019-5-16 18:24:05
        Track end time  : 2019-5-16 18:38:04
        Distance        : 13147 m
        Average speed   : 57.1 km/h
        Riding time     : 838 min.
        Start point     :
                Latitude : xx.xxxxxx
                Longitude: xx.xxxxxx
        End point       :
                Latitude : xx.xxxxxx
                Longitude: xx.xxxxxx
```

There you will find the track id and the track date, which are necessay to retrieve the full detail.
Now generate a KML file from a complete recorded track of your NIU e-scooter with the following call:

```
node niu-cloud-cli.js get-track-detail --token <token> --sn <serial-number> --trackId <track-id> --trackDate <track-date> --kml > track.kml
```

Load the generated track.kml file in google earth or google map and voila!

![track_kml_example](https://github.com/BlueAndi/niu-cloud-cli/blob/master/doc/track_kml.jpg)

## Issues, Ideas and bugs

If you have further ideas or you found some bugs, great! Create a [issue](https://github.com/BlueAndi/niu-cloud-connector/issues) or if
you are able and willing to fix it by yourself, clone the repository and create a pull request.

## License
The whole source code is published under the [MIT license](http://choosealicense.com/licenses/mit/).
