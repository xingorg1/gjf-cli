exports.getPromptModules = () => {
  return [
    'babel',
    'pwa'
  ].map(file => require(`../promptModules/${file}`)) // [ [Function: bable], [Function: pwa] ]
}
