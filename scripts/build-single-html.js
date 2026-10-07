import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const publicDir = path.resolve('public');

if (fs.existsSync(distDir)) {
  const htmlFile = path.join(distDir, 'index.html');
  let html = fs.readFileSync(htmlFile, 'utf-8');

  // Find css and js files in dist/assets
  const assetsDir = path.join(distDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    const cssFile = files.find(f => f.endsWith('.css'));
    const jsFile = files.find(f => f.endsWith('.js') && !f.includes('workbox'));

    if (cssFile) {
      const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');
      // Replace stylesheet link with inline style
      html = html.replace(/<link rel="stylesheet"[^>]*>/, `<style>${cssContent}</style>`);
    }

    if (jsFile) {
      const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');
      // Replace module script with inline script
      html = html.replace(/<script type="module"[^>]*><\/script>/, `<script type="module">${jsContent}</script>`);
    }
  }

  // Save standalone file in public folder for direct download
  const outputFile = path.join(publicDir, 'Land_Ledger_Mobile_App.html');
  fs.writeFileSync(outputFile, html, 'utf-8');
  console.log('Single standalone HTML created successfully at:', outputFile);
}
