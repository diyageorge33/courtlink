const bcrypt = require("bcrypt");

async function run() {
  const hash = await bcrypt.hash("12345", 10);
  console.log(hash);
}

run();