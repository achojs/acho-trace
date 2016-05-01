'use strict'

var Acho = require('acho')
Acho = require('..')(Acho)

var acho = Acho({
  timestamp: true
})

/* Trace successful sync */

function fn (text) { return text }

var wrapFnOne = acho.traceSync(fn, {
  level: 'debug',
  context: 'exec',
  trace: function (text) {
    return ['fn with result: %s', text]
  }
})

wrapFnOne('hello world')

var wrapFnTwo = acho.traceSync(fn, {
  level: 'debug',
  context: 'opening'
})

wrapFnTwo('hello world')

/* Trace err sync */

function fnErr () {
  throw new Error('executing fnErr')
}

var wrapErrOne = acho.traceSync(fnErr, {
  level: 'info',
  levelErr: 'fatal',
  context: 'opening',
  traceErr: function (err) {
    return err
  }
})

var wrapErrTwo = acho.traceSync(fnErr, {
  level: 'info',
  levelErr: 'fatal'
})

try {
  wrapErrOne()
} catch(err) {}

try {
  wrapErrTwo()
} catch(err) {}
