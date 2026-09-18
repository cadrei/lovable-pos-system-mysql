// /src/emails/SaleEmail.tsx
import { Body, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from "react-email";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import type { SaleEmailProps } from "../types/emailTypes";
import {
  bodyStyle,
  cardStyle,
  containerStyle,
  detailsLabelStyle,
  detailsTableStyle,
  detailsValueStyle,
  folioBadgeStyle,
  footerStyle,
  footerTextStyle,
  headerStyle,
  hrStyle,
  logoStyle,
  messageStyle,
  productCellRightStyle,
  productCellStyle,
  productHeaderCellRightStyle,
  productHeaderCellStyle,
  productTableStyle,
  sectionLabelStyle,
  titleStyle,
  totalFinalLabelStyle,
  totalFinalValueStyle,
  totalsLabelStyle,
  totalsRowStyle,
  totalsValueStyle,
} from "./styles";

const APP_URL = process.env["APP_URL"] ?? "";
const FALLBACK = "No disponible";

/** Formatea fecha de forma segura. Si es inválida, retorna la fecha actual. */
function safeFormatDate(input: Date | string | undefined | null): string {
  const date = input instanceof Date ? input : new Date(input ?? "");
  const safe = isValid(date) ? date : new Date();
  return format(safe, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
}

/** Formatea un monto en USD. */
function usd(value: number | string): string {
  const n = typeof value === "number" ? value : Number(value);
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
}

export function SaleEmail({
  idVenta,
  fechaHora,
  sucursalNombre,
  empleadoNombre,
  cajero,
  clienteNombre,
  sesionCajaId,
  metodo,
  referencia,
  subtotal = 0,
  descuento = 0,
  valorImpuesto = 0,
  total = 0,
  lineas = [], //
}: SaleEmailProps) {
  const fechaFormateada = safeFormatDate(fechaHora);

  const generalRows: Array<{ label: string; value: string }> = [
    { label: "Fecha y hora", value: fechaFormateada },
    { label: "Sucursal", value: sucursalNombre || FALLBACK },
    { label: "Empleado", value: empleadoNombre || FALLBACK },
    { label: "Cajero", value: cajero || FALLBACK },
    { label: "Cliente", value: clienteNombre || FALLBACK },
    { label: "Método de pago", value: metodo || FALLBACK },
  ];

  if (sesionCajaId != null) {
    generalRows.push({ label: "Sesión de caja", value: `#${sesionCajaId}` });
  }
  if (referencia) {
    generalRows.push({ label: "Referencia", value: referencia });
  }

  return (
    <Html lang="es">
      <Head />
      <Preview>Nueva venta registrada en POS Naturista</Preview>
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
            <Heading style={titleStyle}>Nueva venta registrada</Heading>

            <Text style={messageStyle}>
              Se ha completado una venta en el sistema POS. A continuación el detalle de la
              transacción.
            </Text>

            <div style={folioBadgeStyle}>Id de Venta: {idVenta}</div>

            <Hr style={hrStyle} />

            {/* ─── Información general ─── */}
            <Text style={sectionLabelStyle}>Información general</Text>
            <table style={detailsTableStyle} cellPadding={0} cellSpacing={0}>
              <tbody>
                {generalRows.map((r) => (
                  <tr key={r.label}>
                    <td style={detailsLabelStyle}>{r.label}</td>
                    <td style={detailsValueStyle}>{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ─── Detalle de productos ─── */}
            <Text style={sectionLabelStyle}>Detalle de productos</Text>
            <table style={productTableStyle} cellPadding={0} cellSpacing={0}>
              <thead>
                <tr>
                  <th style={productHeaderCellStyle}>Producto</th>
                  <th style={productHeaderCellRightStyle}>Cant.</th>
                  <th style={productHeaderCellRightStyle}>P. Unit.</th>
                  <th style={productHeaderCellRightStyle}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(lineas ?? []).map((l, i) => (
                  <tr key={`${l.nombre}-${i}`}>
                    <td style={productCellStyle}>{l.nombre}</td>
                    <td style={productCellRightStyle}>{l.cantidad}</td>
                    <td style={productCellRightStyle}>{usd(l.precio)}</td>
                    <td style={productCellRightStyle}>{usd(l.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ─── Totales ─── */}
            <table style={productTableStyle} cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td style={totalsLabelStyle}>Subtotal</td>
                  <td style={totalsValueStyle}>{usd(subtotal)}</td>
                </tr>
                {descuento > 0 && (
                  <tr>
                    <td style={totalsLabelStyle}>Descuento</td>
                    <td style={totalsValueStyle}>- {usd(descuento)}</td>
                  </tr>
                )}
                {valorImpuesto > 0 && (
                  <tr>
                    <td style={totalsLabelStyle}>Impuesto</td>
                    <td style={totalsValueStyle}>{usd(valorImpuesto)}</td>
                  </tr>
                )}
                <tr>
                  <td style={totalFinalLabelStyle}>Total</td>
                  <td style={totalFinalValueStyle}>{usd(total)}</td>
                </tr>
              </tbody>
            </table>
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
export default SaleEmail;
