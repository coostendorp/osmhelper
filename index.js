var shell = require("shelljs")
var path = require("path")
const runDir = process.cwd()
if (!shell.which("docker-compose")) {
    shell.echo("Sorry, this script requires docker-compose")
    shell.exit(1)
}

{
    shell.mkdir("-p", `${runDir}/osmhelper/data`)

    shell.cp(
        "-Ru",
        `${runDir}/node_modules/osmhelper/template_mapping.yaml`,
        `${runDir}/osmhelper/template_mapping.yaml`
    )

    shell.cp(
        "-Ru",
        `${runDir}/node_modules/osmhelper/.env`,
        `${runDir}/osmhelper/.env`
    )
}

require("dotenv").config({ path: process.cwd() + "/osmhelper/.env" })

shell.env["PROJECT_DIR"] = runDir
const envPath = runDir.concat("/osmhelper/.env")
shell.cd(__dirname)

const dlUrl = new URL(process.env["PBF_URL"])
const filename = path.basename(dlUrl.pathname)
const outputPath = `osmhelper/data/${filename}`

const commands = {
    init: function () {},
    start: function () {
        if (
            shell.exec(`docker-compose  --env-file ${envPath} up --build -d`)
                .code !== 0
        ) {
            shell.echo("Error: startup")
            shell.exit(1)
        }
    },
    download: function () {
        // Download the PBF
        if (
            !shell.test(
                "-f",
                `${runDir}/osmhelper/data/philippines-latest.osm.pbf`
            )
        ) {
            console.log(
                `Downloading ${process.env["PBF_URL"]} to ${outputPath}`
            )
            const cmd = `docker-compose --env-file ${envPath} exec -T -e PROJECT_DIR=${runDir} postgis \
		wget --output-document=/opt/project/${outputPath} \
		${process.env["PBF_URL"]} && chmod 666 ${outputPath}`

            if (shell.exec(cmd).code !== 0) {
                shell.echo("Error: download")
                shell.exit(1)
            }
        } else {
            console.log(
                `Found ${outputPath}, so not downloading again. Delete it if you want a fresh one.`
            )
        }
    },
    imposm: function () {
        console.log(
            `Importing ${outputPath} to Postgis using mapping ${process.env["ACTIVE_MAPPING"]}`
        )
        if (
            shell.exec(
                `docker-compose --env-file ${envPath} exec -T postgis \
                ./imposm import \
                -overwritecache \
                -dbschema-import public \
                -srid ${process.env["IMPOSM_SRID"]} \
                -mapping /opt/project/${process.env["ACTIVE_MAPPING"]} \
                -read /opt/project/${outputPath} \
                -write \
                -connection postgis://postgres:postgres@localhost/postgres?prefix=NONE
		`
            ).code !== 0
        ) {
            shell.echo("Error: imposm")
            shell.exit(1)
        }
    },
    down: function () {
        if (
            shell.exec(`docker-compose --env-file ${envPath} down -v`).code !==
            0
        ) {
            shell.echo("Error: down")
            shell.exit(1)
        }
    },
}

var command = process.argv.slice(2)[0]

commands[command]()
