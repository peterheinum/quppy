const { filter, prop } = require('ramda')
/**
 * @param {fns} functions that are iterated with args giving result to next function and running it
 * @param {args} argument to pass to the first function
 */
const asyncPipe = (...fns) => (args) => fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(args))

const filterEmpty = filter(prop('length'))

module.exports = { asyncPipe, filterEmpty }