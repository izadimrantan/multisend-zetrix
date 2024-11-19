import Container from "@/components/container";
import TitlePrimary from "@/components/title_primary";
import Subtitle from "@/components/subtitle";
import Paragraph from "@/components/paragraph";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multisend - Terms of Use",
  description: "Terms of Use for Multisend. Revision date: 4th September 2024",
};

export default function Terms() {
  return (
    <Container activeKey="terms">
      <TitlePrimary>Terms of Use</TitlePrimary>
      <Subtitle>
        Revision date: 4th September 2024
      </Subtitle>
      <h3 className="text-lg font-bold mt-4">1. General Information</h3>
      <Paragraph>Welcome to Zetrix Multisend. By accessing or using our airdrop tool, you agree to be bound by these Terms and Conditions ({"\""}Terms{"\""}). If you do not agree with these Terms, please do not use our tool.</Paragraph>

      <h3 className="text-lg font-bold mt-4">2. Use of the Airdrop Tool</h3>
      <Paragraph>You are responsible for ensuring that all information you provide is accurate and complete.</Paragraph>

      <h3 className="text-lg font-bold mt-4">3. User Responsibilities</h3>
      <Paragraph>By using this site, you are responsible for maintaining the security of your wallet and its private keys.</Paragraph>

      <h3 className="text-lg font-bold mt-4">4. Submission and Approval</h3>
      <Paragraph>We reserve the right to refuse service to anyone, for any reason, at any time.We are not responsible for any errors or issues arising from your submission or wallet approval process.</Paragraph>

      <h3 className="text-lg font-bold mt-4">5. Limitation of Liability</h3>
      <Paragraph>Our airdrop tool is provided {"\""}as is{"\""} and {"\""}as available{"\""} without any warranties of any kind.</Paragraph>
      <Paragraph className="mt-2">We do not guarantee the accuracy, completeness, or reliability of the airdrop process or the successful execution of transactions.</Paragraph>
      <Paragraph className="mt-2">To the maximum extent permitted by law, we shall not be liable for any direct, indirect, incidental, consequential, or special damages, including but not limited to loss of profits, data, or other intangible losses, resulting from your use of the airdrop tool or any errors or issues related to the airdrop process.</Paragraph>
      <Paragraph className="mt-2">It is understood and agreed that, unless expressly stated herein, we are not making and has not at any time made any warranties or representations of any kind or character, express or implied, with respect to any transaction interest, including, but not limited to, any warranties or representations as to merchantability or fitness for a particular purpose.</Paragraph>

      <h3 className="text-lg font-bold mt-4">6. Changes to Terms of Service</h3>
      <Paragraph>We reserve the right to modify these Terms at any time. Any changes will be effective upon posting the revised Terms on our website.</Paragraph>
      <Paragraph className="mt-2">Your continued use of the airdrop tool following any changes constitutes your acceptance of the new Terms.</Paragraph>

      <h3 className="text-lg font-bold mt-4">7. Termination</h3>
      <Paragraph>We reserve the right to terminate or suspend your access to the airdrop tool at our sole discretion, without notice, for any reason.</Paragraph>

      <h3 className="text-lg font-bold mt-4">8. Contact Information</h3>
      <Paragraph>If you have any questions or concerns about these Terms, please contact us at help@zetrix.com.</Paragraph>
    </Container>
  );
}
