/// <reference types="node" />
import * as fs from "node:fs";
import * as path from "node:path";

async function main() {
  // Carpeta fija en la raíz del proyecto
  const carpetaImagenes = path.resolve("./images");

  // Nombre de archivo a verificar
  const nombreArchivo = "CRELAB-01.jpg";

  // Construir la ruta completa
  const rutaCompleta = path.join(carpetaImagenes, nombreArchivo);

  try {
    await fs.promises.access(rutaCompleta, fs.constants.F_OK);
    console.log(`✅ Imagen encontrada: ${rutaCompleta}`);
  } catch {
    console.error(`❌ Imagen NO encontrada: ${rutaCompleta}`);
  }
}

main();
