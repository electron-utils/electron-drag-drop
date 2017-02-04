'use strict';

const platform = require('electron-platform');

if ( platform.isMainProcess ) {
  // init electron-ipc-plus in main process
  require('electron-ipc-plus');
  return;
}

function _getPropertyDescriptor(obj, name) {
  if (!obj) {
    return null;
  }

  let pd = Object.getOwnPropertyDescriptor(obj, name);
  return pd || _getPropertyDescriptor(Object.getPrototypeOf(obj), name);
}

function _copyprop(name, source, target) {
  let pd = _getPropertyDescriptor(source, name);
  Object.defineProperty(target, name, pd);
}

module.exports = {
  drag: require('./lib/drag'),
  droppable: require('./lib/droppable'),

  addon (obj, ...args) {
    obj = obj || {};
    for (let i = 0; i < args.length; ++i) {
      let source = args[i];

      for ( let name in source) {
        if ( !(name in obj) ) {
          _copyprop( name, source, obj);
        }
      }
    }
    return obj;
  }
};
