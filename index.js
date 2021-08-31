const { exec: _exec, spawn: _spawn } = require('child_process')

/** @type {(command: string, call?: (value: string) => void) => Promise<string>} */
function spawn(command, call) {
  return new Promise((resolve, reject) => {
    let result = []
    const proc = _spawn(command, { shell: true })
    proc.stdout.on("data", data => {
      result.push(data.toString().trim())
      if (call) call(data.toString().trim())
    })
    proc.stderr.on("data", data => {
      reject(data.toString())
    })
    proc.stdout.on("close", code => {
      resolve(result.join("\n"))
    })
  })
}

async function main() {
  try {
    const arg = process.argv.slice(2).join(" ")
    await spawn(`node src/get-commits.js ${arg}`, console.log)
    await spawn(`cp -r -f static/* dist`, console.log)
    spawn(`node src/server.js ${arg}`, console.log)
  } catch (err) {
    console.error(err);
    process.exit(-1)
  }
}

if (!module.parent) {
  main()
}