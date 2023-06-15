import express from 'express';
import fs from 'fs';
import mermaid from 'mermaid';
import path from 'path';

const app = express();
const port = 3000;


mermaid.initialize({ startOnLoad: true });

async function getFilesAndDiagrams(directory) {
  const files = fs.readdirSync(directory);
  const diagramCodes = await Promise.all(files.map(file => import(`./drawings/${file}`).then(module => module.default)));
  return files.map((file, index) => ({ file, diagramCode: diagramCodes[index] }));
}

(async () => {
  const drawingFiles = await getFilesAndDiagrams('./drawings');

  drawingFiles.forEach(({ file, diagramCode }) => {
    const name = path.parse(file).name;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${name}</title>
        <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
        <script>
          document.addEventListener("DOMContentLoaded", function () {
            mermaid.initialize({ startOnLoad: true });
          });
        </script>
      </head>
      <body>
        <div class="mermaid">${diagramCode}</div>
      </body>
      </html>
    `;

    const pagePath = path.join(new URL(import.meta.url).pathname, `../output/${name}.html`);

    fs.mkdirSync(path.join(new URL(import.meta.url).pathname, '../output/'), { recursive: true });
    fs.writeFileSync(pagePath, html, 'utf-8');

    app.get(`/drawings/${name}`, (req, res) => {
      res.sendFile(pagePath);
    });
  });

  console.log('HTML pages generated successfully.');
})();

app.get('/', (req, res) => {
  const drawingFiles = fs.readdirSync('./drawings');
  const tableRows = drawingFiles.map(file => `<tr><td><a href="/drawings/${path.parse(file).name}">${path.parse(file).name}</a></td></tr>`);
  const table = `<table>${tableRows.join('')}</table>`;
  res.send(table);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
