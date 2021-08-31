const http = require('http')
const fs = require('fs')
const path = require('path')

/** @type {(name: string) => string | undefined} */
function getArg(name) {
  const i = process.argv.indexOf(name)
  return process.argv[-1 < i ? i + 1 : -1]
}

function main({
  host = "localhost", port = 3000, root = "dist"
} = {}) {
  http.createServer((req, res) => {
    const filePath = root + req.url.replace(/\/$/, "/index.html")

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500)
        res.end('Error: ' + err.code)
      } else {
        res.writeHead(200)
        res.end(content, 'utf-8')
      }
    })
  }).listen(port)

  console.log(`listening at ${host}:${port}`)
}

if (!module.parent) {
  const host = getArg("-host")
  const port = getArg("-port")
  main({ host, port })
}

module.exports = main
