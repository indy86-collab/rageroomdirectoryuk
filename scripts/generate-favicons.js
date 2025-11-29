/**
 * Script to generate favicon files
 * Run: node scripts/generate-favicons.js
 * 
 * This requires sharp: npm install sharp
 */

const fs = require('fs')
const path = require('path')

// Simple SVG favicon template (Rage Room "R" logo)
const svgTemplate = `
<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" fill="#FF6B35" rx="20"/>
  <text x="90" y="130" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white" text-anchor="middle">R</text>
</svg>
`

const publicDir = path.join(__dirname, '..', 'public')

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// Create SVG favicon
const svgPath = path.join(publicDir, 'favicon.svg')
fs.writeFileSync(svgPath, svgTemplate.trim())

console.log('✅ Created favicon.svg')
console.log('')
console.log('📝 NOTE: You need to create the following image files manually:')
console.log('   - favicon.ico (48x48)')
console.log('   - favicon-32x32.png (32x32)')
console.log('   - favicon-16x16.png (16x16)')
console.log('   - apple-touch-icon.png (180x180)')
console.log('   - logo.png (minimum 112x112, square)')
console.log('')
console.log('💡 You can use an online tool like:')
console.log('   - https://realfavicongenerator.net/')
console.log('   - https://favicon.io/')
console.log('')
console.log('🎨 Design requirements:')
console.log('   - Black/orange "R" rage room icon')
console.log('   - Transparent background (for PNGs)')
console.log('   - Square format')
console.log('   - High resolution for logo.png')

