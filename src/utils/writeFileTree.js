const fs = require('fs-extra')
const path = require('path')

function deleteRemovedFiles (directory, newFiles, previousFiles) {
  // get all files that are not in the new filesystem and are still existing
  const filesToDelete = Object.keys(previousFiles)
    .filter(filename => !newFiles[filename])

  // delete each of these files
  return Promise.all(filesToDelete.map(filename => {
    return fs.unlink(path.join(directory, filename))
  }))
}

/**
 *
 * @param {string} dir
 * @param {Record<string,string|Buffer>} files
 * @param {Record<string,string|Buffer>} [previousFiles]
 * @param {Set<string>} [include]
 */
module.exports = async function writeFileTree (dir, files, previousFiles = false, include) {
  if (previousFiles) {
    await deleteRemovedFiles(dir, files, previousFiles)
  }
  // 将内存中待写入的「文件名/文件内容」的键值对进行遍历，并依次写入到磁盘
  Object.keys(files).forEach((name) => {
    if (include && !include.has(name)) return // FIXME: include not has name ? 
    const filePath = path.join(dir, name)
    fs.ensureDirSync(path.dirname(filePath)) // 要用“fs-extra”这个包的“ensureDirSync”方法才行
    fs.writeFileSync(filePath, files[name])
  })
}
