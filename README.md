# node-marantz

A REST-api wrapper around Marantz Receivers to provide easier remote control.  

Also serves up a web socket with event information, for all setting changes.

## Configuration

Set the `MARANTZ_HOST` ENV var to the IP or hostname of your Marantz Receiver.

## API Routes

#### `GET /state` 

Returns the current state of the receiver

#### `GET /sources`

Returns the list of possible sources

#### `GET /zone/:zone/mute`

Returns the mute status in the specified zone

#### `POST /zone/:zone/mute?isOn`

Turns the specified zone mute on or off.  Value should be passed with the `isOn` query string.

#### `GET /zone/:zone/power`

Returns the power status in the specified zone

#### `POST /zone/:zone/power?isOn`

Turns the specified zone power on or off.  Value should be passed with the `isOn` query string.

#### `GET /zone/:zone/source`

Returns the current source in the specified zone

#### `POST /zone/:zone/source`

Sets the current source in the specified zone

#### `GET /zone/:zone/volume`

Returns the current volume in the specified zone

#### `POST /zone/:zone/volume?level`

Sets the volume in the specified zone to value passed by the `level` query param.  Must be between 0 and 255.

#### `POST /zone/:zone/volume/up`

Increments the volume in the specified zone

#### `POST /zone/:zone/volume/down`

Decrements the volume in the specified zone
