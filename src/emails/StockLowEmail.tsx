// /src/emails/StockLowEmail.tsx
import { Body, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from "react-email";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import type { StockLowEmailProps } from "../types/emailTypes";
import {
  bodyStyle,
  cardStyle,
  containerStyle,
  counterDangerStyle,
  counterStrongStyle,
  counterWarningStyle,
  footerStyle,
  footerTextStyle,
  headerStyle,
  hrStyle,
  logoStyle,
  messageStyle,
  noProductosStyle,
  productCellStyle,
  productHeaderCellRightStyle,
  productHeaderCellStyle,
  productTableStyle,
  stockActualDangerStyle,
  stockActualWarningStyle,
  stockMinimoStyle,
  sucursalCountersStyle,
  sucursalHeaderStyle,
  sucursalTitleStyle,
  summaryBoxStyle,
  summaryLineStyle,
  summaryTitleStyle,
  titleStyle,
} from "./styles";

const APP_URL = process.env["APP_URL"] ?? "";

function safeFormatDate(input: Date | string | undefined | null): string {
  const date = input instanceof Date ? input : new Date(input ?? "");
  const safe = isValid(date) ? date : new Date();
  return format(safe, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
}

/**
 * Determina el estilo del stock actual según su severidad.
 * Como los productos con stock 0 no llegan aquí, solo evaluamos
 * la cercanía al mínimo.
 */
function stockActualStyle(stockActual: number, stockMinimo: number) {
  // Crítico: menos del 30% del mínimo
  if (stockMinimo > 0 && stockActual / stockMinimo <= 0.3) {
    return stockActualDangerStyle;
  }
  return stockActualWarningStyle;
}

export function StockLowEmail({ fechaHora, sucursales = [] }: StockLowEmailProps) {
  const fechaFormateada = safeFormatDate(fechaHora);

  // Totales consolidados calculados dentro de la plantilla
  const totalProductosBajos = sucursales.reduce((acc, s) => acc + s.productosBajos.length, 0);
  const totalProductosSinStock = sucursales.reduce((acc, s) => acc + s.productosSinStock, 0);

  return (
    <Html lang="es">
      <Head />
      <Preview>Alerta de stock bajo en POS Naturista</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Img
              src={`https://i.ibb.co/whft7nZR/logo.png`}
              alt="Naturista Da Vida"
              width="140"
              style={logoStyle}
            />
          </Section>

          <Section style={cardStyle}>
            <Heading style={titleStyle}>⚠️ Alerta de stock bajo</Heading>

            <Text style={messageStyle}>
              Se detectaron productos por debajo del stock mínimo en una o más sucursales.
            </Text>

            <Text style={messageStyle}>
              <strong>Fecha:</strong> {fechaFormateada}
            </Text>

            <Hr style={hrStyle} />

            {/* ─── Sección por sucursal ─── */}
            {sucursales.map((s) => (
              <Section key={String(s.sucursalId)}>
                <div style={sucursalHeaderStyle}>
                  <p style={sucursalTitleStyle}>{s.sucursalNombre}</p>
                  <p style={sucursalCountersStyle}>
                    Productos en stock bajo:{" "}
                    <span style={counterWarningStyle}>{s.productosBajos.length}</span>
                    {" · "}
                    Productos sin stock:{" "}
                    <span style={counterDangerStyle}>{s.productosSinStock}</span>
                  </p>
                </div>

                {s.productosBajos.length > 0 ? (
                  <table style={productTableStyle} cellPadding={0} cellSpacing={0}>
                    <thead>
                      <tr>
                        <th style={productHeaderCellStyle}>Producto</th>
                        <th style={productHeaderCellStyle}>Categoría</th>
                        <th style={productHeaderCellRightStyle}>Actual</th>
                        <th style={productHeaderCellRightStyle}>Mínimo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.productosBajos.map((p) => (
                        <tr key={String(p.idProducto)}>
                          <td style={productCellStyle}>{p.nombreProducto}</td>
                          <td style={productCellStyle}>{p.categoria}</td>
                          <td style={stockActualStyle(p.stockActual, p.stockMinimo)}>
                            {p.stockActual}
                          </td>
                          <td style={stockMinimoStyle}>{p.stockMinimo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <Text style={noProductosStyle}>
                    Sin productos en stock bajo (solo productos sin stock).
                  </Text>
                )}
              </Section>
            ))}

            {/* ─── Resumen general ─── */}
            <div style={summaryBoxStyle}>
              <p style={summaryTitleStyle}>Resumen general</p>
              <p style={summaryLineStyle}>
                Total productos en stock bajo:{" "}
                <span style={counterWarningStyle}>{totalProductosBajos}</span>
              </p>
              <p style={summaryLineStyle}>
                Total productos sin stock:{" "}
                <span style={counterDangerStyle}>{totalProductosSinStock}</span>
              </p>
              <p style={summaryLineStyle}>
                Sucursales afectadas: <span style={counterStrongStyle}>{sucursales.length}</span>
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

export default StockLowEmail;
