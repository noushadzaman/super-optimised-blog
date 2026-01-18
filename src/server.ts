import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log(`Connected to db successfully`);

    //
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.log("An error occured", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
