'use strict';

let drag = {};
module.exports = drag;

const {ipcRenderer} = require('electron');
const ipcPlus = require('electron-ipc-plus');
const _ = require('lodash');
const pathPlus = require('path-plus');

let _dragging = false;
let _type = '';
let _items = [];
let _options = {};

// ==========================
// exports
// ==========================

/**
 * @method start
 * @param {DataTransfer} dataTransfer
 * @param {object} params
 * @param {array} params.items
 * @param {string} params.type
 * @param {string} params.effect
 * @param {boolean} params.buildImage
 * @param {object} params.options
 */
drag.start = function ( dataTransfer, params ) {
  let items = params.items || [];
  let type = params.type || '';
  let effect = params.effect || '';
  let buildImage = !!params.buildImage;
  let options = params.options || {};

  if ( !Array.isArray(items) ) {
    items = [items];
  }

  // NOTE: dragstart and dragend event are dispatching starting from the dragging element.
  //       so it is user's responsiblity to listening on them and call start(), end() in it.
  if ( _dragging ) {
    console.warn('drag.end() has not been invoked.');
  }

  // NOTE: This is why we use IPC instead of dataTransfer.setData() to syncing drag-drop information
  // REF: http://stackoverflow.com/questions/11974077/datatransfer-setdata-of-dragdrop-doesnt-work-in-chrome
  // > apparently chrome allows to read dataTransfer's data only in the drop event this is for security reason
  // > for instance if I "drag over" a credit card number on a remote page,
  // > this one should not be able to read my data unless i have not "dropped"
  _dragging = true;
  _type = type;
  _items = items;
  _options = options;

  // NOTE: https://github.com/atom/electron/issues/1276
  // dataTransfer.setData('text', type);
  // dataTransfer.setData('drag/type', type);
  // dataTransfer.setData('drag/items', JSON.stringify(items));
  dataTransfer.effectAllowed = effect;
  dataTransfer.dropEffect = 'none';

  if ( buildImage ) {
    let img = this.getDragIcon(items);
    dataTransfer.setDragImage(img, -10, 10);
  }

  // NOTE: do not excludeSelf, some panel recieve this message to enable/disable drop element
  ipcPlus.sendToWins('electron-drag-drop:drag-start', {
    type: type,
    items: items,
    options: options,
  });
};

/**
 * @method end
 */
drag.end = function () {
  _dragging = false;
  _type = '';
  _items = [];
  _options = {};

  // NOTE: do not excludeSelf, some panel recieve this message to enable/disable drop element
  ipcPlus.sendToWins('electron-drag-drop:drag-end');
};

/**
 * @method updateDropEffect
 * @param {DataTransfer} dataTransfer
 * @param {string} dropEffect
 */
drag.updateDropEffect = function ( dataTransfer, dropEffect ) {
  if ( ['copy', 'move', 'link', 'none'].indexOf(dropEffect) === -1 ) {
    console.warn( 'dropEffect must be one of \'copy\', \'move\', \'link\' or \'none\'' );
    dataTransfer.dropEffect = 'none';
    return;
  }

  dataTransfer.dropEffect = dropEffect;
};

/**
 * @method type
 * @param {DataTransfer} dataTransfer
 */
drag.type = function ( dataTransfer ) {
  if ( dataTransfer ) {
    // check if this is a file type
    if ( dataTransfer.types.indexOf('Files') !== -1 ) {
      return 'file';
    }

    // DISABLE
    // // try to check drag/type
    // // NOTE: this works when we are in 'drop' event
    // let type = dataTransfer.getData('drag/type');
    // if ( type !== '' ) {
    //   return type;
    // }
  }

  // try to check _type
  // NOTE: this works when we are in 'dragover' event
  if ( _dragging ) {
    return _type;
  }

  return '';
};

/**
 * @method filterFiles
 * @param {array} files
 */
drag.filterFiles = function ( files ) {
  let results = [];

  for ( let i = 0; i < files.length; ++i ) {
    let exists = false;

    // filter out sub file paths
    for ( let j = 0; j < results.length; ++j ) {
      if ( pathPlus.contains(results[j].path, files[i].path) ) {
        exists = true;
        break;
      }
    }

    if ( !exists ) {
      results.push( files[i] );
    }
  }

  return results;
};

/**
 * @method items
 * @param {DataTransfer} dataTransfer
 */
drag.items = function ( dataTransfer ) {
  if ( dataTransfer ) {
    // try to extract items from files
    if ( dataTransfer.files.length > 0 ) {
      let results = new Array(dataTransfer.files.length);
      for ( let i = 0; i < dataTransfer.files.length; ++i ) {
        results[i] = dataTransfer.files[i];
      }

      return results;
    }

    // DISABLE
    // // try to extract drag-drop items from getData().
    // // NOTE: this works when we are in 'drop' event
    // let results = dataTransfer.getData('drag/items');
    // if ( results !== '' ) {
    //   return JSON.parse(results);
    // }
  }

  // if we can not extract drag-drop items from getData(). try to get it from _items
  // NOTE: this works in 'dragover' event, but may failed in 'drop' event since we may run drag.end() before it.
  if ( _dragging ) {
    return _items.slice();
  }

  return [];
};

// NOTE: The image will be blur in retina, still not find a solution.
/**
 * @method getDragIcon
 * @param {array} items
 */
drag.getDragIcon = function (items) {
  let icon = new Image();
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');

  let top = 0;
  context.font = 'normal 12px Arial';
  context.fillStyle = 'white';

  for ( let i = 0; i < items.length; ++i ) {
    let item = items[i];
    if ( i <= 4 ) {
      if ( typeof item === 'object' ) {
        // icon
        // NOTE: the icon may be broken, use naturalWidth detect this
        if (
          item.icon &&
            item.icon.naturalWidth !== undefined &&
            item.icon.naturalWidth !== 0
        ) {
          context.drawImage(item.icon, 0, top, 16, 16);
        }

        // text
        context.fillText(item.name,20,top + 15);
        top += 15;
      } else if ( typeof item === 'string' ) {
        // text
        context.fillText(item, 0, top+15);
        top += 15;
      }
    } else {
      context.fillStyle = 'gray';
      context.fillText('[more...]', 20, top+15);

      break;
    }
  }

  icon.src = canvas.toDataURL();
  return icon;
};

/**
 * @method options
 */
drag.options = function () {
  return _.cloneDeep(_options);
};

/**
 * @method getLength
 * @return {number}
 */
drag.getLength = function () {
  return _items.length;
};

/**
 * @property {boolean} dragging
 */
Object.defineProperty(drag, 'dragging', {
  enumerable: true,
  get () {
    return _dragging;
  },
});

// ==========================
// Ipc
// ==========================

ipcRenderer.on('electron-drag-drop:drag-start', (event, info) => {
  _dragging = true;
  _type = info.type;
  _items = info.items;
  _options = info.options;
});

ipcRenderer.on('electron-drag-drop:drag-end', () => {
  _dragging = false;
  _type = '';
  _items = [];
  _options = {};
});
