export interface FrontmatterData {
  [key: string]: unknown;
}

export function parseFrontmatter(content: string): {
  frontmatter: FrontmatterData;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Invalid frontmatter format');
  }

  const [, frontmatterStr, body] = match;
  const frontmatter = parseYAML(frontmatterStr);

  return { frontmatter, body };
}

export function serializeFrontmatter(
  frontmatter: FrontmatterData,
  body: string
): string {
  const frontmatterStr = stringifyYAML(frontmatter);
  return `---\n${frontmatterStr}---\n${body}`;
}

function parseYAML(yaml: string): FrontmatterData {
  const obj: FrontmatterData = {};
  const lines = yaml.split('\n');
  let currentKey: string | null = null;
  let currentValue: string[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    // Check if it's a key-value line (no leading spaces)
    if (!line.startsWith(' ') && line.includes(':')) {
      // Save previous key-value
      if (currentKey) {
        const joinedValue = currentValue.join('\n').trim();
        obj[currentKey] = parseValue(joinedValue);
      }

      const [key, ...rest] = line.split(':');
      currentKey = key.trim();
      const restValue = rest.join(':').trim();
      currentValue = restValue ? [restValue] : [];
    } else if (currentKey && (line.startsWith('  - ') || line.startsWith('  ') && line.includes(':'))) {
      // Multi-line or array continuation
      currentValue.push(line);
    }
  }

  // Save last key-value
  if (currentKey) {
    const joinedValue = currentValue.join('\n').trim();
    obj[currentKey] = parseValue(joinedValue);
  }

  return obj;
}

function parseValue(value: string): unknown {
  value = value.trim();

  // Handle null/undefined
  if (value === '' || value === 'null' || value === '~') return null;

  // Handle booleans
  if (value === 'true') return true;
  if (value === 'false') return false;

  // Handle numbers
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);

  // Handle strings that start with quotes
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  // Handle arrays (check for lines starting with dash after trimming)
  if (value.includes('\n') && value.split('\n').some(line => line.trim().startsWith('- '))) {
    const items = value.split('\n')
      .filter(line => line.trim().startsWith('- '))
      .map(line => {
        const trimmedLine = line.trim().replace(/^- /, '');
        return parseValue(trimmedLine);
      });
    return items.length > 0 ? items : value;
  }

  // Default: return as string
  return value;
}

function stringifyYAML(obj: FrontmatterData): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      lines.push(`${key}: null`);
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        if (typeof item === 'object') {
          // Nested object in array
          lines.push(`  - ${JSON.stringify(item)}`);
        } else {
          lines.push(`  - ${JSON.stringify(item)}`);
        }
      }
    } else if (typeof value === 'object') {
      // Nested object
      lines.push(`${key}:`);
      const nested = stringifyYAML(value as FrontmatterData);
      for (const line of nested.split('\n')) {
        if (line.trim()) lines.push(`  ${line}`);
      }
    } else {
      // String
      const str = String(value);

      // Detect array-like strings (contain YAML array syntax) and convert to arrays
      if (str.includes('\n') && (str.includes('- "') || str.includes('- '))) {
        const arrayItems = str.split('\n')
          .map(line => line.trim())
          .filter(line => line && (line.startsWith('- ') || line.startsWith('- "')))
          .map(line => {
            let item = line.replace(/^-\s*/, '');
            // Remove quotes if present
            if ((item.startsWith('"') && item.endsWith('"')) ||
                (item.startsWith("'") && item.endsWith("'"))) {
              item = item.slice(1, -1);
            }
            // Unescape quotes
            item = item.replace(/\\"/g, '"');
            return item;
          });

        if (arrayItems.length > 0) {
          lines.push(`${key}:`);
          for (const item of arrayItems) {
            lines.push(`  - ${JSON.stringify(item)}`);
          }
          continue;
        }
      }

      // Quote if contains special chars
      if (str.includes(':') || str.includes('#') || str.includes('\n')) {
        lines.push(`${key}: ${JSON.stringify(str)}`);
      } else {
        lines.push(`${key}: ${str}`);
      }
    }
  }

  return lines.join('\n') + '\n';
}
