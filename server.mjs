import { createReadStream } from "node:fs";
import { extname, join } from "node:path";
import { createServer } from "node:http";

const rootDirectory = process.cwd();
const allowedFiles = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/styles.css", "styles.css"],
  ["/src/main.mjs", "src/main.mjs"],
  ["/src/model.mjs", "src/model.mjs"],
]);
const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
]);
const port = Number(process.env.PORT ?? 4173);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new RangeError("PORT debe ser un número entero entre 1 y 65535.");
}

const server = createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Método no permitido.");
    return;
  }

  const requestPath = new URL(request.url ?? "/", "http://localhost").pathname;
  const filePath = allowedFiles.get(requestPath);

  if (!filePath) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("No encontrado.");
    return;
  }

  const stream = createReadStream(join(rootDirectory, filePath));
  response.writeHead(200, {
    "Content-Type": contentTypes.get(extname(filePath)),
    "X-Content-Type-Options": "nosniff",
  });

  if (request.method === "HEAD") {
    stream.destroy();
    response.end();
    return;
  }

  stream.on("error", (error) => {
    console.error(`No se pudo leer ${filePath}:`, error);
    if (!response.headersSent) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    }
    response.end("Error al leer el archivo.");
  });
  stream.pipe(response);
});

server.on("error", (error) => {
  console.error("No se pudo iniciar el servidor local:", error);
  process.exitCode = 1;
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Markov Clima disponible en http://127.0.0.1:${port}/`);
});
