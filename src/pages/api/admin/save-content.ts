import type { APIRoute } from 'astro';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { serializeFrontmatter, parseFrontmatter } from '../../../lib/admin/yaml';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { collection, slug, locale, frontmatter, body } = await request.json();

    if (!collection || !slug || !locale) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: collection, slug, locale' }),
        { status: 400 }
      );
    }

    // Construct file path
    const contentDir = join(process.cwd(), 'src/content');
    const filePath = join(contentDir, collection, slug, `${locale}.md`);

    // Read current file to preserve body if not provided
    let currentBody = body || '';
    if (!body) {
      try {
        const current = readFileSync(filePath, 'utf-8');
        const { body: existingBody } = parseFrontmatter(current);
        currentBody = existingBody;
      } catch {
        // File doesn't exist, body will be empty
      }
    }

    // Serialize and write
    const content = serializeFrontmatter(frontmatter, currentBody);
    writeFileSync(filePath, content, 'utf-8');

    return new Response(
      JSON.stringify({ success: true, path: filePath }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Save error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500 }
    );
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const collection = url.searchParams.get('collection');
    const slug = url.searchParams.get('slug');
    const locale = url.searchParams.get('locale');

    if (!collection || !slug || !locale) {
      return new Response(
        JSON.stringify({ error: 'Missing query params: collection, slug, locale' }),
        { status: 400 }
      );
    }

    const contentDir = join(process.cwd(), 'src/content');
    const filePath = join(contentDir, collection, slug, `${locale}.md`);

    const content = readFileSync(filePath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);

    return new Response(
      JSON.stringify({ frontmatter, body }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Load error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 404 }
    );
  }
};
