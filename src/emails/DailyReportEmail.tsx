// /src/emails/DailyReportEmail.tsx
import { Body, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from "react-email";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import type { DailyReportEmailProps } from "../types/emailTypes";
import {
  bodyStyle,
  cardStyle,
  containerStyle,
  footerStyle,
  footerTextStyle,
  headerStyle,
  hrStyle,
  logoStyle,
  messageStyle,
  metricCardStyle,
  metricLabelStyle,
  metricRowStyle,
  metricValueHighlightStyle,
  metricValueStyle,
  noSalesMessageStyle,
  sucursalHeaderStyle,
  sucursalTitleStyle,
  summaryBoxStyle,
  summaryLineStyle,
  summaryTitleStyle,
  titleStyle,
} from "./styles";

const APP_URL = process.env["APP_URL"] ?? "";

function safeFormatDateLong(input: Date | string | undefined | null): string {
  const date = input instanceof Date ? input : new Date(input ?? "");
  const safe = isValid(date) ? date : new Date();
  return format(safe, "d 'de' MMMM 'de' yyyy", { locale: es });
}

function usd(value: number): string {
  const n = Number(value);
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
}

export function DailyReportEmail({ fechaReporte, sucursales = [] }: DailyReportEmailProps) {
  const fechaFormateada = safeFormatDateLong(fechaReporte);

  // ─── Totales consolidados ───
  const totalVentasConsolidado = sucursales.reduce((acc, s) => acc + (s.totalVentas || 0), 0);
  const totalTransacciones = sucursales.reduce((acc, s) => acc + (s.numeroTransacciones || 0), 0);
  const ticketPromedioGeneral =
    totalTransacciones > 0 ? totalVentasConsolidado / totalTransacciones : 0;
  const sucursalesConVentas = sucursales.filter((s) => s.numeroTransacciones > 0).length;

  return (
    <Html lang="es">
      <Head />
      <Preview>Reporte diario de ventas - POS Naturista</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Img
              src={`${APP_URL}/images/logo.png`}
              alt="Naturista Da Vida"
              width="140"
              style={logoStyle}
            />
          </Section>

          <Section style={cardStyle}>
            <Heading style={titleStyle}>📊 Reporte diario de ventas</Heading>
            <Text style={messageStyle}>Resumen de operaciones del {fechaFormateada}</Text>

            <Hr style={hrStyle} />

            {/* ─── Sección por sucursal ─── */}
            {sucursales.map((s) => (
              <Section key={String(s.sucursalId)}>
                <div style={sucursalHeaderStyle}>
                  <p style={sucursalTitleStyle}>{s.sucursalNombre}</p>
                </div>

                {s.numeroTransacciones > 0 ? (
                  <div style={metricCardStyle}>
                    <p style={metricRowStyle}>
                      <span style={metricLabelStyle}>Total ventas:</span>
                      <span style={metricValueHighlightStyle}>{usd(s.totalVentas)}</span>
                    </p>
                    <p style={metricRowStyle}>
                      <span style={metricLabelStyle}>Transacciones:</span>
                      <span style={metricValueStyle}>{s.numeroTransacciones}</span>
                    </p>
                    <p style={metricRowStyle}>
                      <span style={metricLabelStyle}>Ticket promedio:</span>
                      <span style={metricValueStyle}>{usd(s.ticketPromedio)}</span>
                    </p>
                  </div>
                ) : (
                  <Text style={noSalesMessageStyle}>Sin ventas registradas en el período.</Text>
                )}
              </Section>
            ))}

            {/* ─── Resumen general ─── */}
            <div style={summaryBoxStyle}>
              <p style={summaryTitleStyle}>Resumen general</p>
              <p style={summaryLineStyle}>
                Total ventas consolidadas:{" "}
                <span style={metricValueHighlightStyle}>{usd(totalVentasConsolidado)}</span>
              </p>
              <p style={summaryLineStyle}>
                Total transacciones: <span style={metricValueStyle}>{totalTransacciones}</span>
              </p>
              <p style={summaryLineStyle}>
                Ticket promedio general:{" "}
                <span style={metricValueStyle}>{usd(ticketPromedioGeneral)}</span>
              </p>
              <p style={summaryLineStyle}>
                Sucursales con ventas: <span style={metricValueStyle}>{sucursalesConVentas}</span>
              </p>
            </div>
          </Section>

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>Este correo es automático, no responder.</Text>
            <Text style={footerTextStyle}>
              © {new Date().getFullYear()} Naturista Da Vida · POS
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default DailyReportEmail;
