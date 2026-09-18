import { EMAIL_SUBJECT_MAP } from "../../types/emailTypes";
import { LoginEmail } from "../../emails/LoginEmail";
import { ADMIN_NOTIFICATION_EMAIL } from "./client.server";
import { sendMailWithTimeout } from "./sendMail.server";

export interface NotifyLoginInput {
  nombre: string;
  email: string;
  sucursalNombre: string;
  nombreEmpleado: string;
  ip?: string | null;
  userAgent?: string | null;
}

/**
 * Notifica al administrador que un usuario inició sesión.
 * NO lanza excepciones: retorna void siempre. Si el envío falla,
 * solo loggea el error y el flujo de login continúa.
 */
export async function notifyLogin(input: NotifyLoginInput): Promise<void> {
  if (!ADMIN_NOTIFICATION_EMAIL) {
    console.error(
      "🔴 [notifyLogin] ADMIN_NOTIFICATION_EMAIL no está configurado. " +
        "Se omite la notificación.",
    );
    return;
  }

  try {
    const result = await sendMailWithTimeout({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: EMAIL_SUBJECT_MAP.LOGIN,
      template: LoginEmail,
      props: {
        nombre: input.nombre,
        email: input.email,
        sucursalNombre: input.sucursalNombre,
        nombreEmpleado: input.nombreEmpleado,
        fechaHora: new Date(),
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
      },
    });

    if (!result.success) {
      console.error("🔴 [notifyLogin] Falló el envío:", {
        email: input.email,
        error: result.error,
        errorCode: result.errorCode,
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("🔴 [notifyLogin] Excepción no controlada:", {
      email: input.email,
      message,
    });
  }
}
