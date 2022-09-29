const { Pool } = require("pg")

const pool = new Pool({
    user: process.env["POSTGRES_USERNAME"],
    password: process.env["POSTGRES_PASSWORD"],
    port: process.env["POSTGRES_PORT"],
    host: "localhost",
    database: "postgres",
})

module.exports = pool
