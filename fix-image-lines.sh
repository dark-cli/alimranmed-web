#!/bin/bash

# Fix images that are on the same line as text and add blank line after images
# This ensures images are rendered as block elements, not inline

FIXED=0

find src/content -name "*.md" -type f | while read file; do
  # Check if file has content
  if [ ! -s "$file" ]; then
    continue
  fi

  # Use awk to:
  # 1. Separate images from text on the same line
  # 2. Add blank line after image lines
  awk '
  /^!\[.*\]\([^)]*\).*[^ ]$/ && !/^!\[.*\]\([^)]*\)$/ {
    # Found image with text on same line - split at the ) mark
    match($0, /^(!\[[^\]]*\]\([^)]*\))(.*)/, arr)
    print arr[1]
    print ""
    print arr[2]
    next
  }
  /^!\[.*\]\([^)]*\)$/ {
    # Image on its own line - add blank line after if next line is not blank
    print $0
    print ""
    next
  }
  { print }
  ' "$file" > "${file}.tmp"

  # Check if file changed
  if ! diff -q "$file" "${file}.tmp" > /dev/null 2>&1; then
    mv "${file}.tmp" "$file"
    echo "✓ Fixed: $file"
    ((FIXED++))
  else
    rm "${file}.tmp"
  fi
done

echo ""
echo "Fixed $FIXED files"
