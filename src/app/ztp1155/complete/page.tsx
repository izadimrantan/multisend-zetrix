"use client"

import ButtonPrimary from "@/components/button_primary";
import Card from "@/components/card";
import Container from "@/components/container";
import Progress from "@/components/progress_ztp20";
import TitlePrimary from "@/components/title_primary";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { useSearchParams } from 'next/navigation'
import { Suspense } from "react";

function CompleteContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const url = `https://${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${searchParams.get("tx") ?? "unknown"}`

    function goHome() {
        // Redirect to home
        router.push("/ztp1155");
    }

    return (
        <Container activeKey="ztp1155">
            <div className="mx-auto max-w-xl">
                <div className="text-center">
                    <TitlePrimary>Airdrop Tool</TitlePrimary>
                    <p>Send ZTP-1155 tokens to multiple recipients at once</p>
                </div>
                <Progress className="mt-6" stage={3} />
                <Card className="mt-6">
                    <Fireworks autorun={{ speed: 2, duration: 2000 }} />
                    <div className="text-center justify-center">
                        <p className="text-xl font-bold">Congratulation</p>
                        <RocketLaunchIcon className="w-24 stroke-1 mx-auto py-12" />
                        <p>You have sent an airdrop. You can view your transaction{" "}
                            <Link className="text-text_red/80 hover:text-text_red" href={url} target="_blank">here</Link>
                        </p>
                    </div>
                    <div className="mt-6 text-right border-t border-white/10 pt-2 lg:pt-4">
                        <ButtonPrimary onClick={goHome}>Let{"'"}s do it again</ButtonPrimary>
                    </div>
                </Card>
            </div>
        </Container>
    );
}

export default function Complete() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CompleteContent />
        </Suspense>
    );
}