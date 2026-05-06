import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const BROCHURE_DIR = path.join(process.cwd(), 'public', 'brochures');
const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg'];

/** Normalize a string for fuzzy matching */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // replace special chars with space
    .replace(/\s+/g, ' ')          // collapse multiple spaces
    .trim();
}

/** Find the best matching brochure file for a given course title */
function findBrochure(courseTitle: string): string | null {
  if (!fs.existsSync(BROCHURE_DIR)) return null;

  const files = fs.readdirSync(BROCHURE_DIR).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ALLOWED_EXTENSIONS.includes(ext);
  });

  const normalizedTitle = normalize(courseTitle);

  // 1. Exact match (normalized)
  for (const file of files) {
    const fileBase = normalize(path.basename(file, path.extname(file)));
    if (fileBase === normalizedTitle) return file;
  }

  // 2. File name starts with course title
  for (const file of files) {
    const fileBase = normalize(path.basename(file, path.extname(file)));
    if (fileBase.startsWith(normalizedTitle)) return file;
  }

  // 3. Course title starts with file name
  for (const file of files) {
    const fileBase = normalize(path.basename(file, path.extname(file)));
    if (normalizedTitle.startsWith(fileBase) && fileBase.length > 3) return file;
  }

  // 4. File name contains course title (or vice versa)
  for (const file of files) {
    const fileBase = normalize(path.basename(file, path.extname(file)));
    if (fileBase.includes(normalizedTitle) || normalizedTitle.includes(fileBase)) {
      if (fileBase.length > 3) return file;
    }
  }

  // 5. Word-level overlap — score by how many words match
  const titleWords = normalizedTitle.split(' ').filter(w => w.length > 2);
  let bestFile: string | null = null;
  let bestScore = 0;

  for (const file of files) {
    const fileBase = normalize(path.basename(file, path.extname(file)));
    const fileWords = fileBase.split(' ').filter(w => w.length > 2);
    const matches = titleWords.filter(w => fileWords.includes(w)).length;
    const score = matches / Math.max(titleWords.length, fileWords.length);
    if (score > bestScore && score >= 0.5) {
      bestScore = score;
      bestFile = file;
    }
  }

  return bestFile;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseTitle = searchParams.get('title');

  if (!courseTitle || courseTitle.trim() === '') {
    return NextResponse.json({ error: 'Course title is required' }, { status: 400 });
  }

  const matchedFile = findBrochure(courseTitle.trim());

  if (!matchedFile) {
    return NextResponse.json(
      { error: `No brochure found for "${courseTitle}"` },
      { status: 404 }
    );
  }

  // Security: resolve and verify the file is inside BROCHURE_DIR
  const filePath = path.resolve(BROCHURE_DIR, matchedFile);
  if (!filePath.startsWith(path.resolve(BROCHURE_DIR))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Brochure file not found' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(matchedFile).toLowerCase();

  const contentTypeMap: Record<string, string> = {
    '.pdf':  'application/pdf',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
  };

  const contentType = contentTypeMap[ext] || 'application/octet-stream';

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${matchedFile}"`,
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
