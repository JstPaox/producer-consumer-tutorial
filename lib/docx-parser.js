const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

async function parseDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  const text = result.value;
  
  const codeBlocks = extractCodeBlocks(text);
  const posts = extractPosts(text);
  
  return { posts, codeBlocks, generated: new Date().toISOString() };
}

function extractCodeBlocks(text) {
  const blocks = [];
  const lines = text.split('\n');
  let inBlock = false;
  let currentLines = [];
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Start of C# block: using System or namespace
    if (!inBlock && (trimmed.startsWith('using System') || trimmed.startsWith('namespace '))) {
      inBlock = true;
      currentLines = [line];
      braceCount = 0;
      continue;
    }
    
    if (inBlock) {
      currentLines.push(line);
      
      // Count braces
      for (const ch of line) {
        if (ch === '{') braceCount++;
        if (ch === '}') braceCount--;
      }
      
      // End block when braces balanced and we hit empty line after }
      if (braceCount === 0 && trimmed === '' && currentLines.length > 10) {
        const code = currentLines.join('\n');
        blocks.push({
          id: blocks.length + 1,
          code,
          summary: extractSummary(code),
          tags: extractTags(code)
        });
        inBlock = false;
        currentLines = [];
        braceCount = 0;
      }
    }
  }
  
  // Handle last block if file ends without trailing newline
  if (inBlock && braceCount === 0) {
    const code = currentLines.join('\n');
    blocks.push({
      id: blocks.length + 1,
      code,
      summary: extractSummary(code),
      tags: extractTags(code)
    });
  }
  
  return blocks;
}

function extractSummary(code) {
  const firstLine = code.split('\n').find(l => l.trim().length > 0);
  return firstLine ? firstLine.trim().substring(0, 80) : 'C# code block';
}

function extractTags(code) {
  const tags = [];
  if (code.match(/Semaphore/i)) tags.push('semafori');
  if (code.match(/BlockingCollection/i)) tags.push('queue');
  if (code.match(/NamedPipe|PipeStream/i)) tags.push('pipe');
  if (code.match(/SharedMemory|FileMapping/i)) tags.push('shared-memory');
  if (code.match(/Socket|Tcp|Udp/i)) tags.push('socket');
  if (code.match(/Thread/i)) tags.push('thread');
  if (code.match(/WaitOne|Release/i)) tags.push('sincronizzazione');
  if (code.match(/Monitor|lock\s*\(/i)) tags.push('lock');
  if (code.match(/Producer|Consumer|Produttore|Consumatore/i)) tags.push('produttore-consumatore');
  return tags.length ? tags : ['generale'];
}

function extractPosts(text) {
  const posts = [];
  const postRegex = /Post di ([^\n]+)\n([^\n]+)\n\nData di creazione: ([^\n]+)/g;
  let match;
  while ((match = postRegex.exec(text)) !== null) {
    posts.push({
      author: match[1].trim(),
      date: match[3].trim(),
      title: `Post di ${match[1].trim()}`
    });
  }
  if (posts.length === 0) {
    posts.push({ author: 'alberto veneziani', date: '20 gen', title: 'Produttore-Consumatore base' });
  }
  return posts;
}

async function main() {
  const docxPath = path.join(__dirname, '../../TPSIT - Dizionario.docx');
  const outputPath = path.join(__dirname, '../../data/docdata.json');
  
  try {
    const data = await parseDocx(docxPath);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`Parsed ${data.codeBlocks.length} code blocks, ${data.posts.length} posts. Saved to data/docdata.json`);
    console.log('Tags found:', [...new Set(data.codeBlocks.flatMap(b => b.tags))]);
  } catch (err) {
    console.error('Parse error:', err.message);
  }
}

if (require.main === module) main();

module.exports = { parseDocx };
