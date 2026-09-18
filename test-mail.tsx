import "dotenv/config";
import { createElement } from "react";
import { sendMail } from "./src/server-functions/mailer/sendMail.server";
import { GenericEmail } from "./src/emails/GenericEmail";
import { LoginEmail } from "./src/emails/LoginEmail";
import { SaleEmail } from "./src/emails/SaleEmail";
import {
  ADMIN_NOTIFICATION_EMAIL,
  RESEND_FROM_EMAIL,
} from "./src/server-functions/mailer/client.server";

/**
 * Script de prueba manual.
 * Ejecutar con:  npx tsx test-mail.ts [plantilla]
 *
 * plantilla: generic | login | sale    (default: generic)
 */
// Declaración mínima para evitar @types/node
declare const process: {
  env: Record<string, string | undefined>;
  argv: string[];
  exit(code?: number): never;
};

type Plantilla = "generic" | "login" | "sale";
const plantillaArg = (process.argv[2] ?? "generic") as Plantilla;

async function main() {
  // ─── Validaciones previas ───
  if (!process.env.RESEND_API_KEY) {
    console.error("🔴 RESEND_API_KEY no está definida en .env");
    process.exit(1);
  }
  if (!ADMIN_NOTIFICATION_EMAIL) {
    console.error("🔴 ADMIN_NOTIFICATION_EMAIL no está definida en .env");
    process.exit(1);
  }

  console.log("🔵 [test-mail] Configuración:");
  console.log("   From:       ", RESEND_FROM_EMAIL);
  console.log("   To:         ", ADMIN_NOTIFICATION_EMAIL);
  console.log("   Plantilla:  ", plantillaArg);
  console.log("   APP_URL:    ", process.env.APP_URL ?? "(no definida)");
  console.log("");

  let result;

  switch (plantillaArg) {
    case "login":
      result = await sendMail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: "NATURISTA DA VIDA - INICIO DE SESIÓN | Prueba",
        template: LoginEmail,
        props: {
          nombre: "David Cordero",
          email: "dacrei@gmail.com",
          sucursalNombre: "Sucursal Central",
          nombreEmpleado: "Baltazar",
          fechaHora: new Date(),
          ip: "192.168.1.100",
          userAgent: "Chrome 128 / Windows 11",
        },
      });
      break;

    case "sale":
      result = await sendMail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: "NATURISTA DA VIDA - VENTA | Prueba",
        template: SaleEmail,
        props: {
          idVenta: 12345,
          fechaHora: new Date(),
          sucursalNombre: "Sucursal Central",
          empleadoNombre: "David Cordero",
          cajero: "María López",
          clienteNombre: "Juan Pérez",
          sesionCajaId: 42,
          metodo: "EFECTIVO",
          referencia: "DOC-001",
          subtotal: 18.5,
          descuento: 1.5,
          valorImpuesto: 2.04,
          total: 19.04,
          lineas: [
            {
              nombre: "Té verde orgánico 250g",
              cantidad: 2,
              precio: 5.0,
              subtotal: 10.0,
            },
            {
              nombre: "Miel de abeja pura 500g",
              cantidad: 1,
              precio: 8.5,
              subtotal: 8.5,
            },
          ],
        },
      });
      break;

    case "generic":
    default:
      result = await sendMail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: "NATURISTA DA VIDA - NOTIFICACIÓN | Prueba de sistema",
        template: GenericEmail,
        props: {
          title: "Prueba de correo",
          message:
            "Este es un correo de prueba para verificar que el sistema de envío funciona correctamente.",
          preheader: "Prueba de sistema POS Naturista",
          children: createElement(
            "p",
            { style: { fontSize: "14px", color: "#1F2E2C" } },
            "Si recibes este correo, la integración con Resend + React Email está operativa.",
          ),
        },
      });
      break;
  }

  console.log("");
  if (result.success) {
    console.log("✅ [test-mail] Envío exitoso. ID de Resend:", result.id);
    console.log("   Revisa la bandeja de entrada (y spam) de:", ADMIN_NOTIFICATION_EMAIL);
  } else {
    console.error("❌ [test-mail] Falló el envío:");
    console.error("   Error: ", result.error);
    console.error("   Código:", result.errorCode);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ [test-mail] Error inesperado:", err);
  process.exit(1);
});
