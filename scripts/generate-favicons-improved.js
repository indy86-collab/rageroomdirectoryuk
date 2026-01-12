const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const sourceLogoPath = path.join(publicDir, 'logo.svg');
const sourceFaviconPath = path.join(publicDir, 'favicon-modern.svg');

// Ensure the source files exist
if (!fs.existsSync(sourceLogoPath)) {
  console.error('❌ logo.svg not found in public directory');
  process.exit(1);
}

if (!fs.existsSync(sourceFaviconPath)) {
  console.error('❌ favicon-modern.svg not found in public directory');
  process.exit(1);
}

async function generateFavicons() {
  console.log('🎨 Generating favicons and icons...\n');

  try {
    // Generate favicon.ico (32x32 and 16x16 combined)
    console.log('📦 Generating favicon.ico...');
    await sharp(sourceFaviconPath)
      .resize(32, 32)
      .toFile(path.join(publicDir, 'favicon-32x32.png'));
    
    await sharp(sourceFaviconPath)
      .resize(16, 16)
      .toFile(path.join(publicDir, 'favicon-16x16.png'));
    
    // Note: .ico file generation requires additional steps
    // For now, we generate PNGs and user can convert using online tools or ico library
    console.log('✅ Generated favicon-32x32.png and favicon-16x16.png');

    // Generate Apple Touch Icon (180x180)
    console.log('📱 Generating apple-touch-icon.png...');
    await sharp(sourceFaviconPath)
      .resize(180, 180)
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ Generated apple-touch-icon.png (180x180)');

    // Generate logo.png (512x512 for schema and social)
    console.log('🖼️  Generating logo.png...');
    await sharp(sourceLogoPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'logo.png'));
    console.log('✅ Generated logo.png (512x512)');

    // Generate og-image.png for social media (1200x630)
    console.log('🌐 Generating og-image.png for social media...');
    
    // Create a background with the logo centered
    const logoBuffer = await sharp(sourceLogoPath)
      .resize(400, 400)
      .toBuffer();

    // Create background
    const background = sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 17, g: 17, b: 17, alpha: 1 } // #111111
      }
    });

    await background
      .composite([
        {
          input: logoBuffer,
          top: 115, // Center vertically (630-400)/2
          left: 400 // Center horizontally (1200-400)/2
        }
      ])
      .png()
      .toFile(path.join(publicDir, 'og-image.png'));
    console.log('✅ Generated og-image.png (1200x630)');

    // Generate Android Chrome icons
    console.log('🤖 Generating Android Chrome icons...');
    await sharp(sourceFaviconPath)
      .resize(192, 192)
      .toFile(path.join(publicDir, 'android-chrome-192x192.png'));
    
    await sharp(sourceFaviconPath)
      .resize(512, 512)
      .toFile(path.join(publicDir, 'android-chrome-512x512.png'));
    console.log('✅ Generated android-chrome-192x192.png and android-chrome-512x512.png');

    // Copy favicon-modern.svg as favicon.svg
    console.log('📄 Updating favicon.svg...');
    fs.copyFileSync(sourceFaviconPath, path.join(publicDir, 'favicon.svg'));
    console.log('✅ Updated favicon.svg');

    console.log('\n✨ All favicons and icons generated successfully!');
    console.log('\n📝 Note: For favicon.ico generation, you can:');
    console.log('   1. Use an online converter: https://convertio.co/png-ico/');
    console.log('   2. Upload favicon-32x32.png and favicon-16x16.png');
    console.log('   3. Save the result as favicon.ico in the public directory');
    console.log('\n🚀 Or install png-to-ico: npm install png-to-ico');

  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
