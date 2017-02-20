# Module: drag

## Methods

### drag.start ( dataTransfer, params )

  - `dataTransfer` DataTransfer - The data transfer.
  - `params` object
    - `items` array
    - `type` string
    - `effect` string
    - `buildImage` boolean
    - `options` object - user define options

Start drag behavior. Put this code in the `dragstart` event of your draggable element.

### drag.end ()

Stop drag. Put this code in the `dragend` event of your draggable element.

### drag.updateDropEffect ( dataTransfer, dropEffect )

  - `dataTransfer` DataTransfer - The data transfer.
  - `dropEffect` string

Update drop effect.

### drag.type ( dataTransfer )

  - `dataTransfer` DataTransfer - The data transfer.

### drag.filterFilese ( files )

  - `files` Array

### drag.items ( dataTransfer )

  - `dataTransfer` DataTransfer - The data transfer.

### drag.getDragIcon ( items )

  - `items` Array

### drag.options ()

## Porperties

### drag.dragging (boolean)