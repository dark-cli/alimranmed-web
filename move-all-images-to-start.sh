#!/bin/bash

# Move ALL images in ALL content to the start (after frontmatter)
# Works for treatments, services, posts, cases, etc.

FIXED=0

find src/content -name "*.md" | while read file; do
  temp_file="${file}.tmp"

  awk '
  BEGIN {
    fm_count = 0;
    frontmatter = "";
    images = "";
    content = "";
    content_started = 0;
  }

  /^---/ {
    if (fm_count < 2) {
      fm_count++
      if (fm_count <= 2) {
        frontmatter = frontmatter $0 "\n"
      }
      next
    }
  }

  fm_count < 2 {
    frontmatter = frontmatter $0 "\n"
    next
  }

  /^!\[.*\]\(.*\)/ && fm_count >= 2 {
    # Image line - collect it
    images = images $0 "\n"
    next
  }

  /^$/ && fm_count >= 2 {
    # Blank line after frontmatter
    if (content_started == 0 && images == "") {
      # First blank line after frontmatter, skip it for now
      next
    }
    content = content "\n"
    next
  }

  fm_count >= 2 {
    # Regular content
    content_started = 1
    content = content $0 "\n"
  }

  END {
    # Print frontmatter
    printf "%s", frontmatter

    # Print blank line
    print ""

    # Print images if any
    if (images != "") {
      printf "%s", images
      print ""
    }

    # Print content, clean up extra blank lines
    gsub(/^\n+/, "", content)
    gsub(/\n\n\n+/, "\n\n", content)
    printf "%s", content
  }
  ' "$file" > "$temp_file"

  if ! diff -q "$file" "$temp_file" > /dev/null 2>&1; then
    mv "$temp_file" "$file"
    echo "✓ Fixed: $file"
    ((FIXED++))
  else
    rm "$temp_file"
  fi
done

echo ""
echo "Fixed $FIXED files"
