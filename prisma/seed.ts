import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ['info'] });

async function main() {
  // Clean up existing data
  await prisma.promptTemplate.deleteMany();
  await prisma.modelConfig.deleteMany();

  // Insert Model Config
  await prisma.modelConfig.create({
    data: {
      name: "Default OpenAI",
      provider: "openai",
      modelName: "gpt-4o",
      capabilities: JSON.stringify(["text_to_image", "image_to_image", "multimodal", "copy_generation"]),
      isEnabled: false,
    },
  });

  // Insert Prompt Templates (Rug Category)
  const templates = [
    {
      name: "Rug - White Background",
      category: "rug",
      outputType: "white_bg",
      promptText:
        "Extract the rug from the image and place it on a pure white background. Keep the perspective natural. Ensure crisp clean edges without any white halo. Preserve the original colors and textures.",
      variables: JSON.stringify([]),
      isBuiltin: true,
    },
    {
      name: "Rug - Dimension Annotated",
      category: "rug",
      outputType: "dimension",
      promptText:
        "Add clear dimension lines indicating the width and length of the rug. Use a clean, modern font. Length: {{length}}, Width: {{width}}. Ensure text does not obscure the main pattern.",
      variables: JSON.stringify(["length", "width"]),
      isBuiltin: true,
    },
    {
      name: "Rug - Living Room Scene",
      category: "rug",
      outputType: "scene",
      promptText:
        "Place this rug in a modern, well-lit living room with a neutral-colored sofa, a minimal coffee table, and hardwood floors. Soft natural light coming from a window on the left. The rug should look naturally integrated, casting realistic soft shadows on the floor. Style: {{style}}.",
      variables: JSON.stringify(["style"]),
      isBuiltin: true,
    },
    {
      name: "Desk Mat - Minimal Setup",
      category: "desk_mat",
      outputType: "scene",
      promptText:
        "Place this desk mat on a clean wooden desk. Include a sleek space-gray laptop, a mechanical keyboard, a wireless mouse, and a small potted plant in the corner. Overhead soft lighting. The desk mat must be perfectly flat and straight.",
      variables: JSON.stringify([]),
      isBuiltin: true,
    },
  ];

  for (const t of templates) {
    await prisma.promptTemplate.create({ data: t });
  }

  console.log("Database seeded successfully\!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
