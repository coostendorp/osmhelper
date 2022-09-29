var shell = require("shelljs")
var dotenv = require("dotenv")

dotenv.parse("osmhelper/.env")

if (!shell.which("docker-compose")) {
    shell.echo("Sorry, this script requires docker-compose")
    shell.exit(1)
}

const runDir = process.cwd()
shell.env["PROJECT_DIR"] = runDir.concat("/osmhelper")
const envPath = runDir.concat("/osmhelper/.env")

shell.cd(__dirname)

// Start the dockercompose stack

if (
    shell.exec(`docker-compose  --env-file ${envPath} up --build -d  postgis`)
        .code !== 0
) {
    shell.echo("Error: startup")
    shell.exit(1)
}
