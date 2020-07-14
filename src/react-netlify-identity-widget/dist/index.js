
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./react-netlify-identity-widget.cjs.production.min.js')
} else {
  module.exports = require('./react-netlify-identity-widget.cjs.development.js')
}
