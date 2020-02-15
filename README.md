# Andrew's LED effects

![Demo](example.jpeg)

This project creates a series of effects to be displayed using multiple different renderers:

* Browser-based simulator
* WS2812x directly connected to raspberry pi GPIO using [node-rpi-ws2812x-native](https://github.com/beyondscreen/node-rpi-ws281x-native)
* [Fadecandy server](https://www.adafruit.com/product/1689)

The rPi's native PWM driver does work, but I found the Fadecandy to be a wonderful product with great colour correction and dithering, and the advantage of allowing computers other than rPis to be used.  The system you run it on simply needs to have the FC connected over USB.

## Architecture

This project is written in TypeScript and organised around a number of distinct concepts:

* Shapes
* Layers
* Scenes
* Compositor
* Renderers
* Player

## Hardware setup

Hardware list

* Raspberry Pi 4
* 8GB Micro SD card
* Fadecandy
* USB A - Mini USB cable
* Right-angled 8x2 ribbon cable socket
* Ribbon cable
* WS2812B LED strip (30 LEDs/metre)
* 5V power supply
* WS2812 pre-soldered connectors

Steps:

1. Download [Raspbian lite](https://www.raspberrypi.org/downloads/raspbian/) (current version was Buster)
2. Use [balena Etcher](https://www.balena.io/etcher/) to write it to the SD card
3. Create the `wpa_supplicant.conf` and `ssh` files in the boot partition as instructed by the [headless setup instructions](https://www.raspberrypi.org/documentation/configuration/wireless/headless.md)
4. Eject and remove the SD card from the laptop and plug it into the Pi.
5.

## Troubleshooting:

### The Raspberry Pi 4 doesn't like electricity

It requires a very particular USBC power cable and won't work with my common-or-garden MacBook power supply.  Solved by ordering the [official power supply](https://thepihut.com/products/raspberry-pi-psu-uk).

