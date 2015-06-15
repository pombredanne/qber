var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var DatasetConstants = require('../constants/DatasetConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _dataset = {};

/**
 * Initialize the DATASET.
 * @param  {object} dataset The content of the DATASET
 */
function initialize(dataset) {
  _dataset = dataset;
}

/**
 * Update a DATASET item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _dataset[id] = assign({}, _dataset[id], updates);
}



var DatasetStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire DATASET.
   * @return {object}
   */
  get: function() {
    return _dataset;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
QBerDispatcher.register(function(action) {
  var dataset;

  switch(action.actionType) {
    // This is the INIT action for the dataset
    case DatasetConstants.DATASET_INIT:
      dataset = action.dataset;
      if (dataset !== {}) {
        initialize(dataset);
        DatasetStore.emitChange();
      }
      break;

    default:
      console.log('QBerDispatcher: No matching action');
      // no op
  }
});

module.exports = DatasetStore;