var shell = require("shelljs")

shell.mkdir("-p", "osmhelper/data")

shell.cp(
    "-R",
    "node_modules/osmhelper/template_mapping.yaml",
    "osmhelper/template_mapping.yaml"
)

shell.cp("-R", "node_modules/osmhelper/.env", "osmhelper/.env")
