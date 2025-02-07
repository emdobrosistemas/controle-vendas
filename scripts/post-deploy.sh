#!/bin/bash
cd /home/username/public_html/seu-app
npm install
pm2 restart seu-app || pm2 start server.js --name seu-app 