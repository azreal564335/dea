/**
 * ============================================================================
 * 📦 BUILD BUNDLER SCRIPT (scripts/build-bundle.js)
 * ============================================================================
 * Compiles modular files (css/styles.css, js/ui-modal.js, data/typing-drills.js,
 * data/curriculum.js, js/typing-dojo.js, js/simulators.js, js/app.js)
 * into a single self-contained HTML artifact at:
 * /home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/8223c394-dab1-4c16-8db7-43c01f53f7c1/digital_explorer_academy.html
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..');
const artifactPath = '/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/8223c394-dab1-4c16-8db7-43c01f53f7c1/digital_explorer_academy.html';

const cssContent = fs.readFileSync(path.join(srcDir, 'css', 'styles.css'), 'utf8');
const uiModalJs = fs.readFileSync(path.join(srcDir, 'js', 'ui-modal.js'), 'utf8');
const typingDrillsJs = fs.readFileSync(path.join(srcDir, 'data', 'typing-drills.js'), 'utf8');
const curriculumJs = fs.readFileSync(path.join(srcDir, 'data', 'curriculum.js'), 'utf8');
const typingDojoJs = fs.readFileSync(path.join(srcDir, 'js', 'typing-dojo.js'), 'utf8');
const simulatorsJs = fs.readFileSync(path.join(srcDir, 'js', 'simulators.js'), 'utf8');
const appJs = fs.readFileSync(path.join(srcDir, 'js', 'app.js'), 'utf8');

const bundledHtml = `<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>數位小探險家學院 (Digital Explorer Academy) — ASUS 筆電・中英盲打・網路與 AI 互動學園</title>
  <meta name="description" content="專為 8 歲與 10 歲兒童設計的 ASUS Windows 11 筆電操作、中英注音十指盲打道館、網路黃金關鍵字搜尋與 AI 魔法提示詞互動學習網站。" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@500;700;900&display=swap" rel="stylesheet" />
  <style>
${cssContent}
  </style>
</head>
<body class="show-en">
  <!-- Sticky Top Navigation -->
  <header id="app-header" class="top-nav"></header>

  <!-- Main Content Container -->
  <main id="app-main" class="main-container"></main>

  <!-- Footer -->
  <footer style="text-align:center; padding:1.2rem; color:#64748b; font-size:0.84rem; font-weight:700; border-top:1px solid #e2e8f0; background:#ffffff;">
    🚀 數位小探險家學院 (Digital Explorer Academy) ・ 專為 8 歲與 10 歲孩子打造的 ASUS Windows 11、中英注音盲打、網路搜尋與 AI 互動學園
  </footer>

  <!-- Scripts Inlined in Order -->
  <script>
${uiModalJs}
  </script>
  <script>
${typingDrillsJs}
  </script>
  <script>
${curriculumJs}
  </script>
  <script>
${typingDojoJs}
  </script>
  <script>
${simulatorsJs}
  </script>
  <script>
${appJs}
  </script>
</body>
</html>
`;

fs.writeFileSync(artifactPath, bundledHtml, 'utf8');
console.log(`✅ Successfully bundled self-contained HTML artifact (${bundledHtml.length} bytes) to:`);
console.log(`   ${artifactPath}`);
