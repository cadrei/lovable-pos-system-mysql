import { Body, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from "react-email";
import type { GenericEmailProps } from "../types/emailTypes";
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
  titleStyle,
} from "./styles";

const APP_URL = process.env["APP_URL"] ?? "";

export function GenericEmail({
  preheader = "Notificación del sistema POS Naturista",
  title,
  message,
  children,
}: GenericEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{preheader}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Img
              src={"https://i.ibb.co/whft7nZR/logo.png"}
              alt="Naturista Da Vida"
              width="140"
              style={logoStyle}
            />
          </Section>

          <Section style={cardStyle}>
            <Heading style={titleStyle}>{title}</Heading>
            {message ? <Text style={messageStyle}>{message}</Text> : null}
            <Hr style={hrStyle} />
            <Section>{children}</Section>
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

export default GenericEmail;
