#!/bin/bash

# Synchronize images from English to Arabic versions where Arabic file exists but lacks images
# Usage: ./sync-images.sh

CONTENT_DIR="src/content"
SYNCED=0

# Function to sync images from EN to AR
sync_images() {
  local dir="$1"
  local en_file="$dir/en.md"
  local ar_file="$dir/ar.md"

  if [ ! -f "$en_file" ] || [ ! -f "$ar_file" ]; then
    return
  fi

  # Count images in both files
  en_count=$(grep -c "^!\[" "$en_file" 2>/dev/null || true)
  ar_count=$(grep -c "^!\[" "$ar_file" 2>/dev/null || true)

  # Ensure counts are numeric
  en_count=${en_count:-0}
  ar_count=${ar_count:-0}

  # If EN has images and AR doesn't, copy them
  if [ "$en_count" -gt 0 ] && [ "$ar_count" -eq 0 ]; then
    # Extract images from EN file (lines starting with ![)
    images=$(grep "^!\[" "$en_file")

    if [ -n "$images" ]; then
      # Find where frontmatter ends (after second ---)
      frontmatter_end=$(grep -n "^---" "$ar_file" | tail -1 | cut -d: -f1)

      if [ -z "$frontmatter_end" ]; then
        # No frontmatter, insert at start
        temp_file=$(mktemp)
        echo "$images" > "$temp_file"
        echo "" >> "$temp_file"
        cat "$ar_file" >> "$temp_file"
        mv "$temp_file" "$ar_file"
      else
        # Insert after frontmatter
        temp_file=$(mktemp)
        head -n "$frontmatter_end" "$ar_file" > "$temp_file"
        echo "" >> "$temp_file"
        echo "$images" >> "$temp_file"
        echo "" >> "$temp_file"
        tail -n +$((frontmatter_end + 1)) "$ar_file" >> "$temp_file"
        mv "$temp_file" "$ar_file"
      fi

      echo "✓ Synced: $dir ($en_count images)"
      ((SYNCED++))
    fi
  fi
}

echo "=========================================="
echo "Synchronizing Images EN → AR"
echo "=========================================="
echo ""

# Process treatments
echo "Processing treatments..."
for dir in "$CONTENT_DIR"/treatments/*/; do
  sync_images "$dir"
done

# Process services (1 level deep - e.g., brain-stimulation)
echo ""
echo "Processing services (category level)..."
for dir in "$CONTENT_DIR"/services/*/; do
  sync_images "$dir"
done

# Process services (2 levels deep - e.g., brain-stimulation/tms)
echo ""
echo "Processing services (detail level)..."
for dir in "$CONTENT_DIR"/services/*/*/; do
  if [ -d "$dir" ]; then
    sync_images "$dir"
  fi
done

# Process posts
echo ""
echo "Processing posts..."
for dir in "$CONTENT_DIR"/posts/*/; do
  sync_images "$dir"
done

# Process cases
echo ""
echo "Processing cases..."
for dir in "$CONTENT_DIR"/cases/*/; do
  sync_images "$dir"
done

echo ""
echo "=========================================="
echo "Results:"
echo "  ✓ Synced: $SYNCED files"
echo "=========================================="
