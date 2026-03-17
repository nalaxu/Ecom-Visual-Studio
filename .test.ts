import { PrismaClient } from "@prisma/client";\n\nconst prisma = new PrismaClient({\n  adapter: null // use original behavior\n});
