# Module: droppable (renderer process)

This module needs to addon to an HTMLElmement to make it work.
Here is an example:

```html
<body>
  <div id="drop" class="drop-box" droppable="foo,bar" multi >Drop Area</div>
  <script>
    'use strict'

    const {droppable, addon} = require('../../index');

    let dropEL = document.getElementById('drop');
    addon (dropEL, droppable);
    dropEL._initDroppable(dropEL);
  </script>
</body>
```

## Methods

###  _initDroppable ( dropAreaElement )

  - `dropAreaElement` HTMLElmement

## Properties

### droppable (string)

### multi (boolean)

### canDrop (boolean)

## Events

### drop-area-enter

  - `detail` object
    - `target` HTMLElmement
    - `dataTransfer` DataTransfer
    - `clientX` number
    - `clientY` number
    - `offsetX` number
    - `offsetY` number
    - `dragType` string
    - `dragItems` array
    - `dragOptions` object

### drop-area-leave

  - `detail` object
    - `target` HTMLElmement
    - `dataTransfer` DataTransfer

### drop-area-accept

  - `detail` object
    - `target` HTMLElmement
    - `dataTransfer` DataTransfer
    - `clientX` number
    - `clientY` number
    - `offsetX` number
    - `offsetY` number
    - `dragType` string
    - `dragItems` array
    - `dragOptions` object

### drop-area-move

  - `detail` object
    - `target` HTMLElmement
    - `dataTransfer` DataTransfer
    - `clientX` number
    - `clientY` number
    - `offsetX` number
    - `offsetY` number
    - `dragType` string
    - `dragItems` array
    - `dragOptions` object