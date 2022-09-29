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


// Download the PBF
if (!shell.test("-f", `${runDir}/osmhelper/data/philippines-latest.osm.pbf`)) {
    const cmd = `docker-compose --env-file ${envPath} exec -T -e PROJECT_DIR=${runDir} postgis \
		wget --output-document=data/philippines-latest.osm.pbf \
		https://download.geofabrik.de/asia/philippines-latest.osm.pbf`

    if (shell.exec(cmd).code !== 0) {
        shell.echo("Error: download")
        shell.exit(1)
    }
}

// import
if (
    shell.exec(`docker-compose --env-file ${envPath} exec -T postgis \
		./imposm import \
		-overwritecache \
		-mapping /opt/mapping.yaml \
		-read data/philippines-latest.osm.pbf \
		-write \
		-connection postgis://postgres:postgres@localhost/postgres?prefix=NONE`)
        .code !== 0
) {
    shell.echo("Error: import")
    shell.exit(1)
}
