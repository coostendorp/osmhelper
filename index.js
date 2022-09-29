var shell = require("shelljs");

if (!shell.which("docker-compose")) {
  shell.echo("Sorry, this script requires docker-compose");
  shell.exit(1);
}

console.log(process.cwd);

// shell.cd('config');
//
// if (shell.exec('docker-compose up --build -d  postgis').code !== 0) {
//     shell.echo('Error: startup');
//     shell.exit(1);
// }
