#!/bin/bash

# Move all images in blog/post files to the start of content (after frontmatter)

FIXED=0

find src/content/posts -name "*.md" | while read file; do
  temp_file="${file}.tmp"

  awk '
  BEGIN {
    in_fm = 0;
    fm_count = 0;
    frontmatter = "";
    images = "";
    content = "";
  }

  /^---/ {
    if (fm_count < 2) {
      fm_count++
      frontmatter = frontmatter $0 "\n"
      in_fm = (fm_count == 1)
      next
    }
  }

  in_fm {
    frontmatter = frontmatter $0 "\n"
    next
  }

  /^!\[/ {
    # Image line - collect it
    images = images $0 "\n"
    next
  }

  /^$/ {
    # Blank line
    if (content == "") {
      content = "\n"
    } else {
      content = content "\n"
    }
    next
  }

  {
    # Regular content
    content = content $0 "\n"
  }

  END {
    # Print frontmatter
    printf "%s", frontmatter

    # Print blank line after frontmatter
    print ""

    # Print images if any
    if (images != "") {
      printf "%s", images
      print ""
    }

    # Print content, removing leading blank lines
    sub(/^\n+/, "", content)
    printf "%s", content
  }
  ' "$file" > "$temp_file"

  if ! diff -q "$file" "$temp_file" > /dev/null 2>&1; then
    mv "$temp_file" "$file"
    echo "✓ Moved images: $file"
    ((FIXED++))
  else
    rm "$temp_file"
  fi
done

echo ""
echo "Fixed $FIXED files"
