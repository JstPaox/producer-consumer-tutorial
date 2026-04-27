import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const docxPath = path.join(process.cwd(), 'TPSIT - Dizionario.docx');
    const outputPath = path.join(process.cwd(), 'data', 'docdata.json');
    
    const result = await mammoth.extractRawText({ path: docxPath });
    const text = result.value;
    
    const codeBlocks = extractCodeBlocks(text);
    const posts = extractPosts(text);
    
    const data = { posts, codeBlocks, generated: new Date().toISOString() };
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function extractCodeBlocks(text) {
  const blocks = [];
  const lines = text.split('\n');
  let inBlock = false;
  let current = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed.match(/^(using\s|namespace\s|class\s|static\s|void\s|int\s|public\s|private\s|Semaphore|Thread|BlockingCollection|NamedPipe|SharedMemory|Socket|Tcp)/)) {
      inBlock = true;
      current = { id: blocks.length + 1, code: '', tags: [] };
    }
    
    if (inBlock) {
      current.code += line + '\n';
      if (trimmed === '' && current.code.split('\n').length > 10) {
        blocks.push(finalizeBlock(current));
        inBlock = false;
        current = null;
      }
    }
  }
  
  return blocks;
}

function finalizeBlock(block) {
  const code = block.code;
  const tags = [];
  if (code.match(/Semaphore/i)) tags.push('semafori');
  if (code.match(/BlockingCollection/i)) tags.push('queue');
  if (code.match(/NamedPipe/i)) tags.push('pipe');
  if (code.match(/SharedMemory|FileMapping/i)) tags.push('shared-memory');
  if (code.match(/Socket|Tcp/i)) tags.push('socket');
  if (code.match(/Thread/i)) tags.push('thread');
  return { ...block, tags, summary: code.substring(0, 80).replace(/\n/g, ' ') };
}

function extractPosts(text) {
  const posts = [];
  const regex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    posts.push({ date: m[1], title: `Post ${posts.length + 1}` });
  }
  return posts;
}
