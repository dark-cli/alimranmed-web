#!/bin/bash

# Remove English-only paragraphs from Arabic files
# Keep images, frontmatter, and Arabic content

CLEANED=0

find src/content -name "ar.md" | while read file; do
  temp_file="${file}.tmp"

  # Read file and process paragraphs
  awk '
  BEGIN { para = ""; skip_next_blank = 0 }

  /^---/ {
    # Print frontmatter as-is
    if (para) { print para; para = "" }
    print
    next
  }

  /^$/ {
    # Blank line - check if previous paragraph was English-only
    if (para) {
      # Count Arabic characters (ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي)
      if (para ~ /[ا-ي]/) {
        # Has Arabic - keep it
        print para
      }
      # else skip English-only paragraph
      para = ""
    }
    print  # Print blank line
    next
  }

  /^!\[/ || /^-/ || /^\*/ || /^\[/ || /^#/ || /^[0-9]/ {
    # Image, list, heading, link, number - keep as-is
    if (para) { print para; para = "" }
    print
    next
  }

  {
    # Regular content line
    if (para == "") para = $0
    else para = para "\n" $0
  }

  END {
    if (para) {
      if (para ~ /[ا-ي]/) print para
    }
  }
  ' "$file" > "$temp_file"

  if ! diff -q "$file" "$temp_file" > /dev/null 2>&1; then
    mv "$temp_file" "$file"
    echo "✓ Cleaned: $file"
    ((CLEANED++))
  else
    rm "$temp_file"
  fi
done

echo ""
echo "Cleaned $CLEANED files"
