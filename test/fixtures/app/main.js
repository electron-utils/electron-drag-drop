const {app, BrowserWindow} = require('electron');

let win = null;

app.on('ready', function () {
  win = new BrowserWindow({
    center: true,
    width: 800,
    height: 600
  });
  win.loadURL('file://' + __dirname + '/index.html');
});
