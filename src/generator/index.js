module.exports = (api, options) => {
  api.render('./template', {
    doesCompile: api.hasPlugin('babel') || api.hasPlugin('typescript'),
    useBabel: api.hasPlugin('babel')
  })
}
