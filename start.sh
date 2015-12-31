#!/bin/bash
forever start -o logs/info.log -e logs/err.log -c /home/bo/soft/node/bin/nodemon bin/www

