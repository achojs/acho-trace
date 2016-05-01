'use strict'

aku = require 'aku'

createHandler = (acho, fn, level, context) ->
  handler = ->
    unless fn
      args = arguments
    else
      args = fn.apply(fn, arguments)
      args = [args] unless Array.isArray args

    acho.context = context
    acho[level].apply(acho, args)

module.exports = (Acho) ->
  Trace = (options) ->
    acho = Acho(options)

    acho.trace = (fn, opts) ->
      context = opts.context or fn.name
      handle = createHandler(acho, opts.trace, opts.level, context)
      errHandle = createHandler(acho, opts.traceErr, opts.levelErr or 'error', context)
      trace = if opts.sync then aku.sync else aku
      trace(fn, handle, errHandle)

    acho.traceSync = (fn, opts) ->
      opts.sync = true
      acho.trace fn, opts

    acho
