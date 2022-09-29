var shell = require("shelljs")

const runDir = process.cwd()
shell.env["PROJECT_DIR"] = runDir.concat("osmhelper")
const envPath = process.cwd().concat("/osmhelper/.env")
shell.cd(__dirname)

if (shell.exec(`docker-compose --env-file ${envPath} down -v`).code !== 0) {
    shell.echo("Error: import")
    shell.exit(1)
}
