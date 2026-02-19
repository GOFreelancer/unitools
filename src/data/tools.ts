export type ToolCategory = "PDF" | "Image" | "Text" | "Developer" | "Student";
export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
};

export const tools: Tool[] = [
  {
    slug: "pdf-merge",
    name: "PDF Merge",
    description: "Combine multiple PDFs into one quickly.",
    category: "PDF",
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    description: "Convert images (JPG/PNG) into a single PDF.",
    category: "Image",
  },
  {
    slug: "pdf-editor",
    name: "PDF Editor",
    description: "Edit PDFs easily: draw, erase, add images, and write text.",
    category: "PDF",
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, and reading time.",
    category: "Text",
  },
  {
    slug: "qr-generator",
    name: "QR Generator",
    description: "Create QR codes for links and text.",
    category: "Developer",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Compress images locally for faster sharing.",
    category: "Image",
  },
];
