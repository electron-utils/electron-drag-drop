# Module: droppable (renderer process)

Addon this module to an exists HTMLElmement or assign it to the prototype of a CustomElement.

Addon to an exists HTMLElmement:

```html
<body>
  <div id="drop" class="drop-box" droppable="foo,bar" multi >Drop Area</div>
  <script>
    'use strict'

    const {droppable, addon} = require('electron-drag-drop');

    let dropEL = document.getElementById('drop');
    addon (dropEL, droppable);
    dropEL._initDroppable(dropEL);
  </script>
</body>
```

Assign it to the prototype of a CustomElement:

```javascript
const {droppable, addon} = require('electron-drag-drop');

class MyElement extends window.HTMLElement {
  constructor () {
    super();

    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.innerHTML = `
      <div class="drop-area">
        Drop Area
      </div>
    `;

    this.$droparea = this.shadowRoot.querySelector('.drop-area');
    this._inited = false;
  }

  connectedCallback () {
    if ( this._inited ) {
      return;
    }
    this._inited = false;
    this._initDroppable(this.$droparea);
  }
}

addon(MyElement.prototype, droppable);

window.customElements.define('my-element', MyElement);
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