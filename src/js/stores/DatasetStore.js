var QBerDispatcher = require('../dispatcher/QBerDispatcher');
var EventEmitter = require('events').EventEmitter;
var DatasetConstants = require('../constants/DatasetConstants');
var MessageStore = require('./MessageStore');
var BrowserStore = require('./BrowserStore');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _dataset;
var _schemes;
var _dimensions;
var _variable;
var _variable_search;
var _just_selected_variable = false;
var _user;

/**
 * Initialize the DATASET.
 * @param  {object} dataset The content of the DATASET
 */
function initialize(dataset) {
  console.log("Initializing DatasetStore");
  console.log(dataset);
  _dataset = dataset;
}


/**
 * Set the selected VARIABLE .
 * @param {string} variable The to be selected VARIABLE
 */
function setVariable(variable){
  _variable = variable;
}

/**
 * Set the list of dimensions.
 * @param {array} dimensions The list of community dimensions
 */
function setDimensions(dimensions){
  _dimensions = dimensions;
}

/**
 * Set the list of concept schemes.
 * @param {array} schemes The list of community schemes
 */
function setSchemes(schemes){
  _schemes = schemes;
}


/**
 * Set the selected VARIABLE .
 * @param {string} variable The to be selected VARIABLE
 */
function setVariable(variable){
  _variable = variable;
}


/**
 * Set the user.
 * @param {object} user The user details
 */
function setUser(user){
  _user = user;
}


var DatasetStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire DATASET.
   * @return {object}
   */
  get: function() {
    return _dataset;
  },

  /**
   * Get all variable names in the DATASET.
   * @return {object}
   */
  getVariableNames: function() {
    if (_dataset === undefined || _dataset.variables === undefined){
      return [];
    } else {
      return Object.keys(_dataset.variables);
    }
  },


  /**
   * Get the selected VARIABLE.
   * @return {string}
   */
  getVariable: function() {
    return _variable;
  },

  /**
   * Get the dimensions.
   * @return {array}
   */
  getDimensions: function() {
    return _dimensions;
  },

  /**
   * Get the schemes.
   * @return {array}
   */
  getSchemes: function() {
    return _schemes;
  },

  /**
   * Get the user details.
   * @return {object}
   */
  getUser: function(){
    return _user;
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
  var variable;
  console.log('DatasetStore: received '+action.actionType);

  switch(action.actionType) {
    // Register the logged in user
    case DatasetConstants.REGISTER_USER:
      if (action.user !== undefined) {
        setUser(action.user);
        console.log('User set in store');
        DatasetStore.emitChange();
        console.log('Emitted change for datasetstore after user set');
      }
      break;
    // We have retrieved a list of dimensions from the CSDH
    case DatasetConstants.DIMENSIONS_INIT:
      dimensions = action.dimensions;
      if (dimensions !== undefined) {
        setDimensions(dimensions);
        DatasetStore.emitChange();
      }
      break;
    // We have retrieved a list of concept schemes from the CSDH
    case DatasetConstants.SCHEMES_INIT:
      schemes = action.schemes;
      if (schemes !== undefined) {
        setSchemes(schemes);
        DatasetStore.emitChange();
      }
      break;
    // This is the INIT action for the dataset
    case DatasetConstants.DATASET_INIT:
      dataset = action.dataset;
      if (dataset !== undefined) {
        initialize(dataset);
        DatasetStore.emitChange();
      }
      break;
    // This is where we set the currently selected variable
    case DatasetConstants.DATASET_CHOOSE_VARIABLE:
      variable = action.variable;
      if (variable !== ""){
        setVariable(variable);
        DatasetStore.emitChange();
      }
      break;

    default:
      console.log('DatasetStore: No matching action');
      // no op
  }
});

module.exports = DatasetStore;
