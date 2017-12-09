var util = require('util');
var fs = require('fs');
var util = require('util');

module.exports = function ConsoleLogging(master, moduleConfig) {
  if(!master)
    return;

  function timestamp() {
    return '[' + new Date().toISOString() + ']';
  }
  function logNotice(msg) {
    logFunction(timestamp() + ' ' + msg + "\n");
  }
  function logDebug() {
    logFunction(arguments);
  }
  function logError(msg) {
    logFunction(timestamp() + ' ' + msg + "\n");
  }

  master.on('logNotice', logNotice);
  master.on('logError', logError);
  master.on('logDebug', logDebug);

  // second instance of Logging will load after reload, unbind event handlers
  master.once('reload', function() {
    master.removeListener('logNotice', logNotice);
    master.removeListener('logError', logError);
    master.removeListener('logDebug', logDebug);
  });

  function logFunction() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[' + new Date().toISOString() + ']');
    str = util.format.apply(this, args) + "\n";
    console.log.apply(this, arguments);
  }

  return {
    notice: logNotice,
    error: logError,
    debug: logDebug,
  }
};
