import { Body, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from "react-email";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import type { LoginEmailProps } from "../types/emailTypes";
import {
  bodyStyle,
  cardStyle,
  containerStyle,
  detailsLabelStyle,
  detailsTableStyle,
  detailsValueStyle,
  footerStyle,
  footerTextStyle,
  headerStyle,
  hrStyle,
  logoStyle,
  messageStyle,
  titleStyle,
  warningBoxStyle,
  warningTextStyle,
} from "./styles";

const APP_URL = process.env["APP_URL"] ?? "";
const FALLBACK = "No disponible";

export function LoginEmail({
  nombre,
  email,
  sucursalNombre,
  nombreEmpleado,
  fechaHora,
  ip,
  userAgent,
}: LoginEmailProps) {
  const fechaSegura = fechaHora && isValid(new Date(fechaHora)) ? new Date(fechaHora) : new Date();
  const fechaFormateada = format(fechaSegura, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });

  const detalles: Array<{ label: string; value: string }> = [
    { label: "Usuario", value: email },
    { label: "Nombre", value: nombre || FALLBACK },
    { label: "Fecha y hora", value: fechaFormateada },
    { label: "Sucursal", value: sucursalNombre || FALLBACK },
    {
      label: "Nombre Empleado",
      value: nombreEmpleado != null ? String(nombreEmpleado) : FALLBACK,
    },
    { label: "Navegador / Dispositivo", value: userAgent || FALLBACK },
    { label: "Dirección IP", value: ip || FALLBACK },
  ];

  return (
    <Html lang="es">
      <Head />
      <Preview>Nuevo inicio de sesión detectado en POS Naturista</Preview>
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
            <Heading style={titleStyle}>Nuevo inicio de sesión detectado</Heading>

            <Text style={messageStyle}>
              Este es un correo generado automáticamente por la aplicación de ventas. Se ha
              detectado un nuevo inicio de sesión exitoso.
            </Text>

            <Hr style={hrStyle} />

            <Text
              style={{
                ...messageStyle,
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              Detalles del acceso
            </Text>

            <table style={detailsTableStyle} cellPadding={0} cellSpacing={0}>
              <tbody>
                {detalles.map((d) => (
                  <tr key={d.label}>
                    <td style={detailsLabelStyle}>{d.label}</td>
                    <td style={detailsValueStyle}>{d.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Section style={warningBoxStyle}>
              <Text style={warningTextStyle}>
                ⚠️ Si no fuiste tú, contacta al administrador inmediatamente.
              </Text>
            </Section>
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

export default LoginEmail;
