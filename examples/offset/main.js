'use strict';

const {app, BrowserWindow} = require('electron');
require('../../index');

let win;

app.on('ready', function () {
  win = new BrowserWindow({
    width: 400,
    height: 300,
  });
  win.loadURL('file://' + __dirname + '/index.html');
});
