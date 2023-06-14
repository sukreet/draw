import express from 'express';
import fs from 'fs';
import mermaid from 'mermaid';


const app = express();
const port = 3000;
import diagramCode from './drawings/diagramCode.mjs';

// Initialize Mermaid
mermaid.initialize({ startOnLoad: true });

// Generate the HTML with the Mermaid diagram
const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>
      document.addEventListener("DOMContentLoaded", function () {
        mermaid.initialize({ startOnLoad: true });
      });
    </script>
  </head>
  <body>
    <div class="mermaid">${diagramCode}</div>
    <div class="mermaid">${diagramCode}</div>
  </body>
  </html>
`;

// Serve the HTML
app.get('/', (req, res) => {
  res.send(html);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

