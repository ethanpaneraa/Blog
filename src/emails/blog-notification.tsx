import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Hr,
} from "@react-email/components";

interface BlogNotificationEmailProps {
  title: string;
  excerpt: string;
  slug: string;
  baseUrl: string;
  unsubscribeUrl: string;
  customMessage?: string;
}

export default function BlogNotificationEmail({
  title,
  excerpt,
  slug,
  baseUrl,
  unsubscribeUrl,
  customMessage,
}: BlogNotificationEmailProps) {
  const postUrl = `${baseUrl}/writing/${slug}`;

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
      <Preview>new blog post: {title}</Preview>
      <Body
        style={{
          backgroundColor: "#111110",
          margin: "0",
          fontFamily: "Geist Mono, monospace",
          color: "#b5b3ad",
          padding: "48px 0",
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            padding: "40px 32px",
            maxWidth: "600px",
            background: "#111110",
            border: "1px solid #3b3a37",
          }}
        >
          <Text
            style={{
              fontSize: "24px",
              color: "#b5b3ad",
              margin: "0 0 24px",
              lineHeight: "1.5",
              fontWeight: "400",
            }}
          >
            ethan pineda - blog
          </Text>
          {customMessage && (
            <Text
              style={{
                fontSize: "16px",
                color: "#b5b3ad",
                margin: "0 0 32px",
                lineHeight: "1.5",
                fontStyle: "italic",
              }}
            >
              {customMessage}
            </Text>
          )}
          <Text
            style={{
              fontSize: "20px",
              color: "#b5b3ad",
              margin: "0 0 16px",
              lineHeight: "1.5",
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: "16px",
              color: "#b5b3ad",
              margin: "0 0 32px",
              lineHeight: "1.5",
            }}
          >
            {excerpt}
          </Text>

          <Link
            href={postUrl}
            style={{
              backgroundColor: "#b5b3ad",
              color: "#111110",
              border: "none",
              padding: "12px 24px",
              fontSize: "14px",
              textDecoration: "none",
              textTransform: "lowercase",
              display: "inline-block",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            read post
          </Link>
          <Hr
            style={{
              border: "none",
              borderTop: "1px solid #3b3a37",
              margin: "32px 0",
            }}
          />
          <Text
            style={{
              fontSize: "14px",
              color: "#6f6d66",
              margin: "32px 0 0",
              lineHeight: "1.5",
            }}
          >
            <Link
              href={unsubscribeUrl}
              style={{
                color: "#6f6d66",
                textDecoration: "underline",
              }}
            >
              unsubscribe from notifications
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
