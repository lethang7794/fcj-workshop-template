const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const CONTENT_DIR = path.join(__dirname, "content");

function extractTitle(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = matter(raw);
    const title = parsed.data?.title;
    return title || null;
  } catch {
    return null;
  }
}

function generateTOC(dirPath, basePath = CONTENT_DIR) {
  const items = [];

  // Subdirectories
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const subDir = path.join(dirPath, entry.name);
      const indexPath = path.join(subDir, "_index.md");
      if (fs.existsSync(indexPath)) {
        const title = extractTitle(indexPath) || entry.name;
        const relLink = path.relative(basePath, subDir).replace(/\\/g, "/");
        items.push(`- [${title}](${relLink})`);
      }
    }
  }

  // Markdown files (excluding _index.md)
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (
      entry.isFile() &&
      entry.name.endsWith(".md") &&
      entry.name !== "_index.md"
    ) {
      const filePath = path.join(dirPath, entry.name);
      const title = extractTitle(filePath) || path.basename(entry.name, ".md");
      const relLink = path.relative(basePath, filePath).replace(/\\/g, "/");
      items.push(`- [${title}](${relLink})`);
    }
  }

  return items.join("\n");
}

function updateIndexFile(dirPath) {
  const indexPath = path.join(dirPath, "_index.md");
  if (!fs.existsSync(indexPath)) return;

  const content = fs.readFileSync(indexPath, "utf-8");
  const tocStart = "<!-- TOC - begin -->";
  const tocEnd = "<!-- TOC - end -->";

  if (!content.includes(tocStart) || !content.includes(tocEnd)) {
    console.log(`⏭️  Skipping ${indexPath} (missing TOC markers)`);
    return;
  }

  const before = content.split(tocStart)[0];
  const after = content.split(tocEnd)[1];
  const toc = generateTOC(dirPath);
  const newContent = `${before}${tocStart}\n${toc}\n${tocEnd}${after}`;

  fs.writeFileSync(indexPath, newContent, "utf-8");
  console.log(`✅ Updated TOC in: ${path.relative(CONTENT_DIR, indexPath)}`);
}

function walk(dir) {
  updateIndexFile(dir);

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      walk(path.join(dir, entry.name));
    }
  }
}

// Run
walk(CONTENT_DIR);
