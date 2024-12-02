require("dotenv").config();
const cli = require("@aptos-labs/ts-sdk/dist/common/cli/index.js");

async function compile() {
  const move = new cli.Move();

  try {
    await move.compile({
      packageDirectoryPath: "contract", // Ensure this path is correct
      namedAddresses: {
        // Use the module name from your contract as the key
        dcrew_address: process.env.NEXT_MODULE_PUBLISHER_ACCOUNT_ADDRESS,
        std: "0x1",
        aptos_framework: "0x1"
      }
    });
    console.log("Compilation successful");
  } catch (error) {
    console.error("Compilation failed:", error);
  }
}

compile();