const path = require("path")
const fs = require("fs")
const { exec: _exec } = require('child_process')

/** @type {(command: string) => Promise<string>} */
function exec(command) {
  return new Promise((resolve, reject) => {
    _exec(command, (error, stdout, stderr) => {
      if (!error) { resolve(stdout) } else { reject(error) }
    })
  })
}

/** @type {(name: string) => string | undefined} */
function getArg(name) {
  const i = process.argv.indexOf(name)
  return process.argv[-1 < i ? i + 1 : -1]
}

async function main(root = "..", depth = "3", max = "50") {
  const pwd = await exec("pwd")

  // get path text and last update time 
  const pathsText = await exec(
    `find ${root} -maxdepth ${depth} -name .git \
    -exec echo -n {} last: \\; -exec stat -f "%m" {} \\;`
  )

  // parse paths text to [path, time] list
  const pathPairs = pathsText.trim().split("\n").filter(v => v)
    .map(v => v.split(/last:(?=\d+$)/))
    .map(([p, t]) => [path.dirname(path.resolve(pwd, p)), t])

  // sort paths by last update time
  const sortedPaths = pathPairs.sort((arr1, arr2) => (
    Number(arr2[1].trim()) - Number(arr1[1].trim())
  )).map(([p, _]) => p)

  // slice paths from 0 to 50
  const slicedPaths = sortedPaths.slice(
    0, Number(max) !== NaN ? Number(max) : 50
  )

  // get git log texts
  const logs = await Promise.all(slicedPaths.map(p => (
    exec(`cd ${p} && git log`).then(v => [p, v]).catch(err => [p, ""])
  )))

  // parse git log texts to git commit object list
  const commits = logs.map(([key, value]) => {
    const _commits = value.split(/(?=^commit)/gm).filter(v => v)

    const result = _commits.map(commit => {
      const texts = commit
        .replace(/Merge: .+\n/gm, "")
        .split(/commit |Author: |Date: |(?<=Date: .+\n)/gm) || []

      const [_, hash, author, date, text] = texts.map(t => t.trim())

      return {
        repo: path.basename(key),
        path: path.dirname(key),
        hash,
        author,
        date,
        text: text.replace(/(?<=\n) {1,4}(\n|)/gm, "")
      }
    })

    return result
  }).flat()

  // get user data
  const user = {
    name: (await exec("git config user.name")).trim(),
    email: (await exec("git config user.email")).trim(),
  }

  const outText = (
    `const Commits = ${JSON.stringify(commits)}\n\n` +
    `const UserInfo = ${JSON.stringify(user)}`
  )

  // write to files
  fs.mkdirSync("dist", { recursive: true })
  fs.writeFileSync("dist/commits.json", JSON.stringify(commits))
  fs.writeFileSync("dist/commits.js", outText)

  console.log("finished get commits")
}

if (!module.parent) {
  main(getArg("-root"), getArg("-depth"), getArg("-max")).catch(console.error)
}

module.exports = main
