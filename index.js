'use strict';

const platform = require('electron-platform');

if ( platform.isMainProcess ) {
  // init electron-ipc-plus in main process
  require('electron-ipc-plus');
  return;
}

module.exports = {
  drag: require('./lib/drag'),
  droppable: require('./lib/droppable'),
};
