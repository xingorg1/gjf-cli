const slash = require('slash')

module.exports = function normalizeFilePaths (files) {
  // [
  //   '.gitignore',
  //   'jsconfig.json',
  //   'public/favicon.ico',
  //   'public/index.html',
  //   'src/App.vue',
  //   'src/main.js',
  //   'src/assets/logo.png',
  //   'src/components/HelloWorld.vue'
  // ].forEach
  Object.keys(files).forEach(file => {
    const normalized = slash(file)
    if (file !== normalized) {
      files[normalized] = files[file]
      delete files[file]
    }
  })
  return files
}
