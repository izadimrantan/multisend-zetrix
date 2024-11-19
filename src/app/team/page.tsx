import Container from "@/components/container";
import TitlePrimary from "@/components/title_primary";
import Paragraph from "@/components/paragraph";
import Card from "@/components/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Multisend - The Team",
    description: "The dedicated team members",
};

export default function Terms() {
    return (
        <Container activeKey="team">
            <TitlePrimary>The Team</TitlePrimary>
            <Paragraph>
                The Multisend project was developed by a dedicated team to offer seamless tools within the Zetrix ecosystem, while exploring the optimal technology stack for future development.
            </Paragraph>
            <Card className="mt-4">
                <Paragraph><span className="font-bold">Irsyad Saidin</span> - UI/UX & Frontend</Paragraph>
                <Paragraph><span className="font-bold">Fahmi Jupri</span> - Business Analyst</Paragraph>
                <Paragraph><span className="font-bold">Izad Imran Tan</span> - Frontend & Smart Contract</Paragraph>
                <Paragraph><span className="font-bold">Ammar Abdullah</span> - Smart Contract Audit</Paragraph>
                <Paragraph><span className="font-bold">Maslan Isa</span> - Others</Paragraph>
            </Card>
            <Paragraph className="mt-4">Thank you to everyone who was involved both directly and indirectly in completing this project.</Paragraph>
        </Container>
    );
}
