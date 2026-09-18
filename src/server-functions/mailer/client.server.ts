// /src/server-functions/mailer/client.server.ts
import { Resend } from "resend";

const RESEND_API_KEY = process.env["RESEND_API_KEY"];
if (!RESEND_API_KEY) {
  console.error(
    "🔴 [mailer/client] RESEND_API_KEY no está definida en el .env. " +
      "Los correos no podrán enviarse.",
  );
}

/**
 * Cliente Resend (singleton).
 * Se instancia una sola vez al importar el módulo.
 *
 * Nota: Aunque RESEND_API_KEY sea undefined, Resend no lanza error al
 * instanciarse. El error aparece al invocar .emails.send(), lo cual
 * es manejado por sendMail() y por el worker de la cola.
 */
export const resend = new Resend(RESEND_API_KEY);

//Email del remitente configurado en Resend.
//El dominio debe estar verificado en el dashboard de Resend.
//Ejemplo: "Naturista Da Vida <notificaciones@tudavida.com>"
export const RESEND_FROM_EMAIL =
  process.env["RESEND_FROM_EMAIL"] ?? "Naturista Da Vida <onboarding@resend.dev>";

//Email del administrador que recibe todas las notificaciones.
//Se usa como destinatario por defecto del sistema.
export const ADMIN_NOTIFICATION_EMAIL = process.env["ADMIN_NOTIFICATION_EMAIL"] ?? "";

if (!ADMIN_NOTIFICATION_EMAIL) {
  console.error(
    "🔴 [mailer/client] ADMIN_NOTIFICATION_EMAIL no está definida en el .env. " +
      "Las notificaciones no tendrán destinatario.",
  );
}
