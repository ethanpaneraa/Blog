import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface ConfirmationEmailProps {
  verificationUrl: string;
}

export function ConfirmationEmail({ verificationUrl }: ConfirmationEmailProps) {
  return (
    <Html>
      <Head>
        <style>{`
          @font-face {
            font-family: 'Geist Mono';
            src: url('https://vercel.com/font/geist-mono/Geist-Mono-Regular.woff2') format('woff2');
          }
        `}</style>
      </Head>
      <Preview>confirm your newsletter subscription</Preview>
      <Body
        style={{
          backgroundColor: "#111110", // gray-00
          margin: "0",
          fontFamily: "Geist Mono, monospace",
          color: "#b5b3ad", // gray-11
          padding: "48px 0",
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            padding: "40px 32px",
            maxWidth: "600px",
            background: "#111110", // gray-00
            border: "1px solid #3b3a37", // gray-06
          }}
        >
          <Text
            style={{
              fontSize: "24px",
              color: "#b5b3ad", // gray-11
              margin: "0 0 24px",
              lineHeight: "1.5",
              fontWeight: "400",
            }}
          >
            ethan pineda
          </Text>

          <Text
            style={{
              fontSize: "16px",
              color: "#b5b3ad", // gray-11
              margin: "0 0 24px",
              lineHeight: "1.5",
            }}
          >
            thanks for subscribing to my newsletter! i write about low-level
            systems, life, and career growth.
          </Text>

          <Text
            style={{
              fontSize: "16px",
              color: "#b5b3ad", // gray-11
              margin: "0 0 32px",
              lineHeight: "1.5",
            }}
          >
            please confirm your email address to receive updates:
          </Text>

          <Button
            href={verificationUrl}
            style={{
              backgroundColor: "var(--gray-A03)",
              color: "var(--gray-00)",
              border: "none",
              padding: "12px 24px",
              fontSize: "14px",
              textDecoration: "none",
              textTransform: "lowercase",
              display: "inline-block",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            confirm subscription
          </Button>

          <Hr
            style={{
              border: "none",
              borderTop: "1px solid #3b3a37", // gray-06
              margin: "32px 0",
            }}
          />

          <Text
            style={{
              fontSize: "14px",
              color: "#6f6d66", // gray-09
              margin: "32px 0 0",
              fontStyle: "italic",
              lineHeight: "1.5",
            }}
          >
            if you didn&apos;t request this subscription, you can safely ignore
            this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
