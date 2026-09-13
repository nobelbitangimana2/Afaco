const fs = require('fs')
// Also copy as favicon.ico alternative
const src = 'c:/Users/HP/Desktop/Nobel/Arsene/AfacoWebsite/AfacoLogo.jpeg'
const dst2 = 'c:/Users/HP/Desktop/Nobel/Arsene/AfacoWebsite/AfacoFrontend/public/favicon-logo.jpeg'
fs.copyFileSync(src, dst2)
console.log('Done')
