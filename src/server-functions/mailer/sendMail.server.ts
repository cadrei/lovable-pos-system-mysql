import { render } from "@react-email/render";
import type { ReactElement } from "react";
import { RESEND_FROM_EMAIL, resend } from "./client.server";
import { SendMailOptions, SendMailResult } from "../../types/emailTypes";

/**
 * Envía un correo transaccional usando Resend + una plantilla React Email.
 *
 * Flujo:
 *   1. Renderiza la plantilla React a HTML.
 *   2. Llama a Resend.emails.send() con from, to, subject y html.
 *   3. Retorna un objeto normalizado con success/error.
 *
 * No lanza excepciones: siempre retorna SendMailResult, para que el
 * llamador (worker de la cola) pueda decidir si reintentar.
 */
export async function sendMail<P>({
  to,
  subject,
  template,
  props,
  replyTo,
  cc,
  bcc,
}: SendMailOptions<P>): Promise<SendMailResult> {
  try {
    // 1. Renderizar la plantilla a HTML
    const html = await render(template(props));

    // 2. Enviar por Resend
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
      ...(cc ? { cc } : {}),
      ...(bcc ? { bcc } : {}),
    });

    // 3. Resend devuelve { data, error } en lugar de lanzar excepción
    if (error) {
      console.error("🔴 [mailer/sendMail] Error de Resend:", {
        to,
        subject,
        error,
      });
      return {
        success: false,
        error: error.message,
        errorCode: error.name,
      };
    }

    console.log("🟢 [mailer/sendMail] Correo enviado:", {
      to,
      subject,
      id: data?.id,
    });

    return {
      success: true,
      id: data?.id,
    };
  } catch (err: unknown) {
    // Errores inesperados (red, render de plantilla, etc.)
    const message = err instanceof Error ? err.message : String(err);
    console.error("🔴 [mailer/sendMail] Excepción no controlada:", {
      to,
      subject,
      message,
      raw: err,
    });

    return {
      success: false,
      error: message,
      errorCode: "UNEXPECTED_ERROR",
    };
  }
}

// ──────────────────────────────────────────────────────────────
// Helper con timeout para envío de correos desde flujos críticos
// ──────────────────────────────────────────────────────────────

const DEFAULT_MAIL_TIMEOUT_MS = 5000;

/**
 * Envuelve sendMail con un timeout máximo.
 * Si Resend no responde en el tiempo definido, retorna un error
 * sin bloquear el flujo del llamador (login, venta, etc.).
 *
 * Nota: no cancela la petición HTTP en curso. Resend podría completar
 * el envío después del timeout, pero el llamador ya habrá continuado.
 */
export async function sendMailWithTimeout<P>(
  options: SendMailOptions<P>,
  timeoutMs: number = Number(process.env["MAIL_TIMEOUT_MS"]) || DEFAULT_MAIL_TIMEOUT_MS,
): Promise<SendMailResult> {
  const timeoutPromise = new Promise<SendMailResult>((resolve) => {
    setTimeout(() => {
      resolve({
        success: false,
        error: `Timeout: sendMail excedió ${timeoutMs}ms`,
        errorCode: "TIMEOUT",
      });
    }, timeoutMs);
  });

  return Promise.race([sendMail(options), timeoutPromise]);
}
