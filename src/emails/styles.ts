import type { CSSProperties } from "react";
import { EMAIL_COLORS as C } from "../types/emailTypes";

/* ──────────────────────────────────────────────────────────────
   Estilos base compartidos por todas las plantillas.
   Todos inline y table-friendly para máxima compatibilidad.
   ────────────────────────────────────────────────────────────── */

export const bodyStyle: CSSProperties = {
  backgroundColor: C.background,
  fontFamily:
    '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: "24px 0",
};

export const containerStyle: CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "0 16px",
};

export const headerStyle: CSSProperties = {
  textAlign: "center",
  padding: "8px 0 24px 0",
};

export const logoStyle: CSSProperties = {
  display: "block",
  margin: "0 auto",
  maxWidth: "140px",
  height: "auto",
};

export const cardStyle: CSSProperties = {
  backgroundColor: C.card,
  borderRadius: "12px",
  border: `1px solid ${C.border}`,
  padding: "32px 28px",
};

export const titleStyle: CSSProperties = {
  color: C.foreground,
  fontSize: "22px",
  fontWeight: 700,
  margin: "0 0 16px 0",
  letterSpacing: "-0.02em",
  lineHeight: "1.3",
};

export const messageStyle: CSSProperties = {
  color: C.foreground,
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 8px 0",
};

export const hrStyle: CSSProperties = {
  borderColor: C.border,
  borderTop: `1px solid ${C.border}`,
  margin: "24px 0",
};

export const footerStyle: CSSProperties = {
  textAlign: "center",
  padding: "24px 8px 8px 8px",
};

export const footerTextStyle: CSSProperties = {
  color: C.mutedForeground,
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "4px 0",
};

/* ──────────────────────────────────────────────────────────────
   Estilos específicos para tablas de detalles (usadas en LoginEmail,
   SaleEmail, etc.)
   ────────────────────────────────────────────────────────────── */

export const detailsTableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  margin: "8px 0 0 0",
};

export const detailsLabelStyle: CSSProperties = {
  color: C.mutedForeground,
  fontSize: "13px",
  fontWeight: 600,
  padding: "10px 12px 10px 0",
  verticalAlign: "top",
  width: "40%",
  borderBottom: `1px solid ${C.border}`,
};

export const detailsValueStyle: CSSProperties = {
  color: C.foreground,
  fontSize: "14px",
  padding: "10px 0",
  verticalAlign: "top",
  borderBottom: `1px solid ${C.border}`,
  wordBreak: "break-word",
};

/* ──────────────────────────────────────────────────────────────
   Aviso de seguridad / warning (borde izquierdo destacado)
   ────────────────────────────────────────────────────────────── */

export const warningBoxStyle: CSSProperties = {
  backgroundColor: C.secondary,
  borderLeft: `4px solid ${C.destructive}`,
  borderRadius: "6px",
  padding: "14px 16px",
  margin: "24px 0 0 0",
};

export const warningTextStyle: CSSProperties = {
  color: C.foreground,
  fontSize: "13px",
  lineHeight: "1.5",
  margin: 0,
};

/* ──────────────────────────────────────────────────────────────
   Estilos específicos para SaleEmail
   ────────────────────────────────────────────────────────────── */

export const folioBadgeStyle: CSSProperties = {
  display: "inline-block",
  backgroundColor: C.primary,
  color: C.primaryForeground,
  fontSize: "14px",
  fontWeight: 700,
  padding: "6px 14px",
  borderRadius: "999px",
  letterSpacing: "0.02em",
  margin: "0 0 20px 0",
};

export const sectionLabelStyle: CSSProperties = {
  color: C.mutedForeground,
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  margin: "24px 0 8px 0",
};

export const productTableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  margin: "4px 0 0 0",
};

export const productHeaderCellStyle: CSSProperties = {
  color: C.mutedForeground,
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  textAlign: "left",
  padding: "8px 8px 8px 0",
  borderBottom: `2px solid ${C.border}`,
};

export const productHeaderCellRightStyle: CSSProperties = {
  ...productHeaderCellStyle,
  textAlign: "right",
  paddingRight: 0,
};

export const productCellStyle: CSSProperties = {
  color: C.foreground,
  fontSize: "13px",
  padding: "10px 8px 10px 0",
  borderBottom: `1px solid ${C.border}`,
  verticalAlign: "top",
};

export const productCellRightStyle: CSSProperties = {
  ...productCellStyle,
  textAlign: "right",
  paddingRight: 0,
  whiteSpace: "nowrap",
};

export const totalsRowStyle: CSSProperties = {
  color: C.foreground,
  fontSize: "13px",
  padding: "6px 0",
};

export const totalsLabelStyle: CSSProperties = {
  color: C.mutedForeground,
  fontSize: "13px",
  textAlign: "right",
  padding: "6px 12px 6px 0",
  width: "80%",
};

export const totalsValueStyle: CSSProperties = {
  color: C.foreground,
  fontSize: "13px",
  textAlign: "right",
  padding: "6px 0",
  whiteSpace: "nowrap",
  width: "20%",
};

export const totalFinalLabelStyle: CSSProperties = {
  color: C.foreground,
  fontSize: "15px",
  fontWeight: 700,
  textAlign: "right",
  padding: "12px 12px 0 0",
  borderTop: `2px solid ${C.border}`,
  width: "80%",
};

export const totalFinalValueStyle: CSSProperties = {
  color: C.primary,
  fontSize: "17px",
  fontWeight: 700,
  textAlign: "right",
  padding: "12px 0 0 0",
  borderTop: `2px solid ${C.border}`,
  whiteSpace: "nowrap",
  width: "20%",
};

/* ──────────────────────────────────────────────────────────────
   Estilos específicos para StockLowEmail
   ────────────────────────────────────────────────────────────── */

export const sucursalHeaderStyle: CSSProperties = {
  backgroundColor: C.secondary,
  borderRadius: "8px",
  padding: "12px 16px",
  margin: "24px 0 12px 0",
};

export const sucursalTitleStyle: CSSProperties = {
  color: C.foreground,
  fontSize: "15px",
  fontWeight: 700,
  margin: "0 0 6px 0",
};

export const sucursalCountersStyle: CSSProperties = {
  color: C.mutedForeground,
  fontSize: "12px",
  lineHeight: "1.6",
  margin: 0,
};

export const counterStrongStyle: CSSProperties = {
  color: C.foreground,
  fontWeight: 700,
};

export const counterWarningStyle: CSSProperties = {
  color: C.warning,
  fontWeight: 700,
};

export const counterDangerStyle: CSSProperties = {
  color: C.destructive,
  fontWeight: 700,
};

export const summaryBoxStyle: CSSProperties = {
  backgroundColor: C.muted,
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "28px 0 0 0",
};

export const summaryTitleStyle: CSSProperties = {
  color: C.foreground,
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  margin: "0 0 10px 0",
};

export const summaryLineStyle: CSSProperties = {
  color: C.foreground,
  fontSize: "13px",
  lineHeight: "1.8",
  margin: 0,
};

export const stockActualDangerStyle: CSSProperties = {
  ...productCellRightStyle,
  color: C.destructive,
  fontWeight: 700,
};

export const stockActualWarningStyle: CSSProperties = {
  ...productCellRightStyle,
  color: C.warning,
  fontWeight: 700,
};

export const stockMinimoStyle: CSSProperties = {
  ...productCellRightStyle,
  color: C.mutedForeground,
};

export const noProductosStyle: CSSProperties = {
  color: C.mutedForeground,
  fontSize: "13px",
  fontStyle: "italic",
  margin: "4px 0 0 0",
};

/* ──────────────────────────────────────────────────────────────
   Estilos específicos para DailyReportEmail
   ────────────────────────────────────────────────────────────── */

export const metricCardStyle: CSSProperties = {
  backgroundColor: C.secondary,
  borderRadius: "8px",
  padding: "14px 18px",
  margin: "8px 0 0 0",
};

export const metricRowStyle: CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.9",
  margin: 0,
  color: C.foreground,
};

export const metricLabelStyle: CSSProperties = {
  color: C.mutedForeground,
  fontSize: "13px",
  display: "inline-block",
  minWidth: "160px",
};

export const metricValueStyle: CSSProperties = {
  color: C.foreground,
  fontSize: "14px",
  fontWeight: 700,
};

export const metricValueHighlightStyle: CSSProperties = {
  color: C.primary,
  fontSize: "16px",
  fontWeight: 700,
};

export const noSalesMessageStyle: CSSProperties = {
  color: C.mutedForeground,
  fontSize: "13px",
  fontStyle: "italic",
  margin: "8px 0 0 0",
};
