import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = 5000; // Restart trigger

async function main() {
  try {
    await prisma.$connect();
    console.log(`Connected to db successfully`);

    //
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
      console.log(`Email Service Configured for: ${process.env.APP_USER}`);
      console.log(`Better Auth URL: ${process.env.BETTER_AUTH_URL}`);
    });
  } catch (error) {
    console.log("An error occured", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
