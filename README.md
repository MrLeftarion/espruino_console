# espruino_console
version: 0.8.2_indev


# pin layouts: 

## oled
|======|======|
| oled |  to  |
|======|======|
| GND  | GND  |
| VCC  | 3V3  |
| D0   | A5   |
| D1   | A7   |
| RES  | A6   |
| DC   | A4   |
| CS   | A10  |
|======|======|
## card reader
|========|======|
| reader |  to  |
|========|======|
| 3V3    | 3V3  |
| CS     | GND  |
| MOSI   | B15  |
| CLK    | B13  |
| MISO   | B14  |
| GND    | GND  |
|========|======|
## joystick
|==========|======|
| joystick |  to  |
|==========|======|
| GND      | GND  |
| +5V      | 3V3  |
| VRX      | A1   |
| VRY      | B0   |
| SW       | B10  |
|==========|======|
## buttons
|========|========|======|
|  name  | button |  to  |
|========|========|======|
| A      | 1      | GND  |
|        | 2      | B8   |
|========|========|======|
| B      | 1      | GND  |
|        | 2      | B9   |
|========|========|======|
| reset  | 1      | GND  |
|        | 2      | RST  |
|========|========|======|