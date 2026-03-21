const bcrypt = require("bcrypt");

async function run() {
  const hash = await bcrypt.hash("diya1234", 10);
  console.log(hash);
}

run();