# Favicon Setup Instructions

## Required Files

The following favicon files need to be created and placed in the `/public` directory:

1. **favicon.ico** (48x48 pixels)
   - Standard favicon format
   - Used by most browsers

2. **favicon-32x32.png** (32x32 pixels)
   - PNG format with transparent background
   - Used by modern browsers

3. **favicon-16x16.png** (16x16 pixels)
   - PNG format with transparent background
   - Used for browser tabs

4. **apple-touch-icon.png** (180x180 pixels)
   - PNG format
   - Used by iOS devices when adding to home screen
   - Should have a solid background (not transparent)

5. **logo.png** (minimum 112x112 pixels, square)
   - PNG format with transparent background
   - Used for Organization schema and social sharing
   - Should be high resolution (recommended: 512x512 or larger)

## Design Requirements

- **Icon**: Black/orange "R" rage room icon
- **Background**: Transparent for PNGs (except apple-touch-icon which should have solid background)
- **Format**: Square aspect ratio
- **Colors**: 
  - Primary: Orange (#FF6B35 or similar)
  - Secondary: Black or white text/icon
- **Style**: Modern, bold, recognizable

## Tools to Generate Favicons

1. **RealFaviconGenerator**: https://realfavicongenerator.net/
   - Upload a high-res logo (512x512 or larger)
   - Generates all required sizes automatically
   - Provides HTML code (already implemented in layout.tsx)

2. **Favicon.io**: https://favicon.io/
   - Simple favicon generator
   - Can create from text or image

3. **Canva/Figma**: 
   - Design the logo first
   - Export at different sizes
   - Use image optimization tools

## Quick Setup Steps

1. Design or obtain a logo image (512x512 PNG recommended)
2. Visit https://realfavicongenerator.net/
3. Upload your logo
4. Configure settings:
   - iOS: Enable, use solid background
   - Android: Enable
   - Windows: Enable
   - Safari: Enable
5. Download the generated package
6. Extract files to `/public` directory:
   - favicon.ico
   - favicon-32x32.png
   - favicon-16x16.png
   - apple-touch-icon.png
   - logo.png (use your original high-res version)

## Verification

After adding the files, verify:
- Files are in `/public` directory
- File names match exactly (case-sensitive)
- Files are accessible at:
  - https://rageroomdirectory.co.uk/favicon.ico
  - https://rageroomdirectory.co.uk/favicon-32x32.png
  - https://rageroomdirectory.co.uk/favicon-16x16.png
  - https://rageroomdirectory.co.uk/apple-touch-icon.png
  - https://rageroomdirectory.co.uk/logo.png

## Current Status

✅ Favicon links added to layout.tsx
✅ Metadata.icons configured
⏳ Waiting for actual favicon files to be created

