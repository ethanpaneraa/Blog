import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Preview,
} from "@react-email/components";

interface BlogNotificationEmailProps {
  title: string;
  excerpt: string;
  slug: string;
  baseUrl: string;
  unsubscribeUrl: string;
}

export default function BlogNotificationEmail({
  title,
  excerpt,
  slug,
  baseUrl,
  unsubscribeUrl,
}: BlogNotificationEmailProps) {
  const postUrl = `${baseUrl}/writing/${slug}`;

  return (
    <Html>
      <Head />
      <Preview>New blog post: {title}</Preview>
      <Body
        style={{ backgroundColor: "#f6f6f6", margin: "0", padding: "30px" }}
      >
        <Container>
          <Section
            style={{
              backgroundColor: "#ffffff",
              padding: "40px",
              borderRadius: "4px",
            }}
          >
            <Text
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              New Blog Post Published
            </Text>
            <Text style={{ fontSize: "20px", marginBottom: "8px" }}>
              {title}
            </Text>
            <Text style={{ color: "#666666", marginBottom: "24px" }}>
              {excerpt}
            </Text>
            <Link
              href={postUrl}
              style={{
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "4px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Read Post
            </Link>
          </Section>
          <Text
            style={{
              textAlign: "center",
              color: "#666666",
              fontSize: "12px",
              marginTop: "16px",
            }}
          >
            <Link href={unsubscribeUrl} style={{ color: "#666666" }}>
              Unsubscribe from notifications
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
