const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const favicon32Path = path.join(publicDir, 'favicon-32x32.png');
const outputPath = path.join(publicDir, 'favicon.ico');

async function generateIco() {
  console.log('🎨 Generating favicon.ico from PNG file...\n');

  try {
    // Check if PNG file exists
    if (!fs.existsSync(favicon32Path)) {
      console.error('❌ favicon-32x32.png not found. Run generate-favicons-improved.js first.');
      process.exit(1);
    }

    // Generate .ico file - using just the 32x32 version
    const ico = await pngToIco(favicon32Path);
    
    fs.writeFileSync(outputPath, ico);
    console.log('✅ Generated favicon.ico successfully!');
    console.log(`📁 Location: ${outputPath}`);
    console.log('\n✨ All favicon files are now ready!');
    
  } catch (error) {
    console.error('❌ Error generating favicon.ico:', error);
    process.exit(1);
  }
}

generateIco();
