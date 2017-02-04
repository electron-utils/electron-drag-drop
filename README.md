# electron-drag-drop

[![Linux Build Status](https://travis-ci.org/electron-utils/electron-drag-drop.svg?branch=master)](https://travis-ci.org/electron-utils/electron-drag-drop)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/h5713cd00dcpvcnl?svg=true)](https://ci.appveyor.com/project/jwu/electron-drag-drop)
[![Dependency Status](https://david-dm.org/electron-utils/electron-drag-drop.svg)](https://david-dm.org/electron-utils/electron-drag-drop)
[![devDependency Status](https://david-dm.org/electron-utils/electron-drag-drop/dev-status.svg)](https://david-dm.org/electron-utils/electron-drag-drop#info=devDependencies)

TODO: Desc

## Install

```bash
npm install --save electron-drag-drop
```

## Run Examples:

```bash
npm start example
```

## Usage

**main process**

```javascript
// init drag-drop in main process
require('electron-drag-drop');
```

**renderer process**

```html
<body>
  <div id="drag" draggable="true">Draggable Item</div>
  <div id="drop" droppable="foobar" multi >Droppable Area</div>

  <script>
    const {drag, droppable, addon} = require('electron-drag-drop');

    // drag
    let dragEL = document.getElementById('drag');

    dragEL.addEventListener('dragstart', event => {
      drag.start(event.dataTransfer, {
        effect: 'copy',
        type: 'foobar',
        items: 'Hello World!',
      });
    });
    dragEL.addEventListener('dragend', event => {
      drag.end();
    });

    // drop
    let dropEL = document.getElementById('drop');

    addon(dropEL, droppable);
    dropEL._initDroppable(dropEL);
    dropEL.addEventListener('drop-area-move', event => {
      drag.updateDropEffect(event.detail.dataTransfer, 'copy');
    });
  </script>
</body>
```

## API Reference

TODO

## License

MIT © 2017 Johnny Wu
