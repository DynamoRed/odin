#!/usr/bin/bash

CURRENTDATE=`date +"%Y-%m-%d %T"`

while :
do
    echo "${CURRENTDATE} | Starting node app..."
    npm run start
    echo "${CURRENTDATE} | App crash :/"
    echo "Restarting node app in 5 seconds !"
    sleep 5
done
