'use strict'

var Acho = require('acho')
Acho = require('..')(Acho)

var acho = Acho({
  timestamp: true
})

function noop () {}

/* Trace successful async */

function createFnAsync () {
  function fnAsync (err, obj, cb) {
    process.nextTick(function () {
      return cb(err, obj)
    })
  }
  return fnAsync
}

var fn = createFnAsync()

var wrapFnOne = acho.trace(fn, {
  level: 'info',
  context: 'wrapFnOne',
  trace: function (text) {
    return ['executing fn with result: %j', text]
  }
})

var wrapFnTwo = acho.trace(fn, {
  level: 'info',
  context: 'wrapFnTwo'
})

wrapFnOne(null, {foo: 'bar'}, noop)
wrapFnOne('fail input', {foo: 'bar'}, noop)
wrapFnTwo(null, {foo: 'bar'}, noop)

/* Trace err async */

function FnAsyncErr (text) {
  function fnAsync (cb) {
    process.nextTick(function () {
      return cb('something bad happens', text)
    })
  }
  return fnAsync
}

var fnErr = FnAsyncErr('Hello world')

var wrapErrOne = acho.trace(fnErr, {
  level: 'info',
  levelErr: 'fatal',
  context: 'wrapErrOne',
  traceErr: function (err) {
    return err
  }
})

var wrapErrTwo = acho.trace(fnErr, {
  level: 'info',
  levelErr: 'fatal',
  context: 'wrapErrTwo',
  traceErr: function (err) {
    return err
  }
})

wrapErrOne(noop)
wrapErrTwo(noop)
