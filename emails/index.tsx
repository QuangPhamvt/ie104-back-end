import { Body, Button, Container, Head, Hr, Html, Img, Preview, Section, Text } from "@react-email/components"
import * as React from "react"

interface WelcomeEmailProps {
  userFirstName: string
  url: string
}

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""

export const WelcomeEmail = ({ userFirstName = "Zeno", url = "" }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>The sales intelligence platform that helps you uncover qualified leads.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section
          style={{
            display: "flex",
            flexDirection: "row",
            margin: "0 auto",
            fontWeight: "bold",
            color: "orange",
            justifyContent: "center",
            fontSize: "24px",
            lineHeight: "32px",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Img
            src={"https://customafk.s3.ap-southeast-1.amazonaws.com/IE104/frontend/brand.png"}
            width="50"
            height="50"
            alt="Bun"
          />
          <Text>Bun ShopFood</Text>
        </Section>
        <Text style={paragraph}>Hi {userFirstName},</Text>
        <Text style={paragraph}>Welcome to BunShop, E-commerce Food Shop to have you order food faster.</Text>
        <Section style={btnContainer}>
          <Button style={button} href={`${url}`}>
            SignUp
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The Bun team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>HCM, VietNam</Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
}

const logo = {
  margin: "0 auto",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
}

const btnContainer = {
  textAlign: "center" as const,
}

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
}

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
}
