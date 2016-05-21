#!/bin/bash 

## really though open two terminals and put one in each

beefy index.js &
websocketd --port=8080 curl --no-buffer -s http://developer.usa.gov/1usagov & 
