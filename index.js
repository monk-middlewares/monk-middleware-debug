var Debug = require('debug')
var mongo = require('mongodb')
var Logger = mongo.Logger
var debugQuery = Debug('monk:query')
var debugResult = Debug('monk:query')

Logger.setCurrentLogger(function (msg, context) {
	if (context.type === 'error') {
		return console.error(msg)
	}
	var logger = Debug('mongo:' + context.className)
	logger.log = console.log.bind(console)
	logger(context.type.toUpperCase() + ': ' + context.message)
})
Logger.setLevel('debug') // set the level to `debug` so we have everything going through debug

module.exports = function debug (context) {
  return function (next) {
    return function (args, method) {
			debugQuery('%s: %j', method, args)
      return next(args, method).then(function (res) {
				debugResult('%s: %j', method, res)
				return res
			})
    }
  }
}
