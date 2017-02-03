'use strict';

const {app, BrowserWindow} = require('electron');
require('../../index');

let win, win2;

app.on('ready', function () {
  win = new BrowserWindow({
    x: 100,
    y: 100,
    width: 400,
    height: 300,
  });
  win.loadURL('file://' + __dirname + '/drag.html');

  win2 = new BrowserWindow({
    x: 510,
    y: 100,
    width: 400,
    height: 300,
  });
  win2.loadURL('file://' + __dirname + '/drop.html');
});
