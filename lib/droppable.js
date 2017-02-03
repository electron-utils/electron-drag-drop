'use strict';

const drag = require('./drag');

// exports
module.exports = {
  /**
   * @property droppable
   */
  get droppable () {
    return this.getAttribute('droppable');
  },
  set droppable (val) {
    this.setAttribute('droppable', val);
  },

  /**
   * @property multi
   */
  get multi () {
    return this.hasAttribute('multi');
  },
  set multi (val) {
    if (val) {
      this.setAttribute('multi', '');
    } else {
      this.removeAttribute('multi');
    }
  },

  /**
   * @property canDrop
   */
  get canDrop () {
    return this._canDrop;
  },

  _initDroppable ( dropAreaElement ) {
    this._dragenterCnt = 0;
    this._canDrop = false;

    dropAreaElement.addEventListener('dragenter', event => {
      ++this._dragenterCnt;

      if ( this._dragenterCnt === 1 ) {
        this._canDrop = false;

        // check if droppable

        // 1. found if we have dragType in droppable attribute
        let droppableList = [];
        if ( this.droppable !== null ) {
          droppableList = this.droppable.split(',');
        }
        let dragType = drag.type(event.dataTransfer);

        let found = false;
        for ( let i = 0; i < droppableList.length; ++i ) {
          if ( dragType === droppableList[i] ) {
            found = true;
            break;
          }
        }

        if ( !found ) {
          this._canDrop = false;
          return;
        }

        // 2. check if we follow the multi drop rule
        let dragItems = drag.items(event.dataTransfer);
        if ( !this.multi && dragItems.length > 1 ) {
          this._canDrop = false;
          return;
        }

        event.stopPropagation(); // NOTE: important for nested

        this._canDrop = true;
        this.setAttribute('drag-hovering', '');

        this.dispatchEvent(new window.CustomEvent('drop-area-enter', {
          bubbles: true,
          detail: {
            target: event.target,
            dataTransfer: event.dataTransfer,

            clientX: event.clientX,
            clientY: event.clientY,
            offsetX: event.offsetX,
            offsetY: event.offsetY,

            dragType: dragType,
            dragItems: dragItems,
            dragOptions: drag.options(),
          }
        }));
      }
    });

    dropAreaElement.addEventListener('dragleave', event => {
      --this._dragenterCnt;

      if ( this._dragenterCnt === 0 ) {
        if ( !this._canDrop ) {
          return;
        }

        event.stopPropagation(); // NOTE: important for nested

        this.removeAttribute('drag-hovering');

        this.dispatchEvent(new window.CustomEvent('drop-area-leave', {
          bubbles: true,
          detail: {
            target: event.target,
            dataTransfer: event.dataTransfer,
          }
        }));
      }
    });

    dropAreaElement.addEventListener('drop', event => {
      this._dragenterCnt = 0;

      if ( !this._canDrop ) {
        return;
      }

      event.preventDefault(); // NOTE: Must have, otherwise we can not drop
      event.stopPropagation();

      this.removeAttribute('drag-hovering');

      this.dispatchEvent(new window.CustomEvent('drop-area-accept', {
        bubbles: true,
        detail: {
          target: event.target,
          dataTransfer: event.dataTransfer,

          clientX: event.clientX,
          clientY: event.clientY,
          offsetX: event.offsetX,
          offsetY: event.offsetY,

          dragType: drag.type(event.dataTransfer),
          dragItems: drag.items(event.dataTransfer),
          dragOptions: drag.options(),
        }
      }));
    });

    dropAreaElement.addEventListener('dragover', event => {
      if ( !this._canDrop ) {
        return;
      }

      event.preventDefault(); // NOTE: Must have, otherwise we can not drop
      event.stopPropagation();

      this.dispatchEvent(new window.CustomEvent('drop-area-move', {
        bubbles: true,
        detail: {
          target: event.target,

          clientX: event.clientX,
          clientY: event.clientY,
          offsetX: event.offsetX,
          offsetY: event.offsetY,

          dataTransfer: event.dataTransfer,
          dragType: drag.type(event.dataTransfer),
          dragItems: drag.items(event.dataTransfer),
          dragOptions: drag.options(),
        }
      }));
    });
  },
};

