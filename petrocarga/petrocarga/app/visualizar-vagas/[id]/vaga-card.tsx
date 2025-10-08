"Use Client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Vaga } from "@/lib/types";
import { Briefcase, DollarSign, MapPin, Users } from "lucide-react";
import Link from "next/link";

export default function JobPostingCard({ vaga }: { vaga: Vaga }) {
    return (
        <Card>
        <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
            <div>
                <h1 className="text-2xl font-bold">{vaga.title}</h1>
                <p className="text-muted-foreground">
                Vaga disponível no{" "}
                <Link
                    href={vaga.company_website}
                    className="text-blue-600 hover:underline"
                >
                    {vaga.company}
                </Link>
                </p>
            </div>
            {/* <Form action={deleteVaga}>
                <input type="hidden" name="id" value={vaga.id} />
                <Button variant="destructive" className="cursor-pointer">
                Apagar Vaga
                </Button>
            </Form> */}
            </div>
        </CardHeader>

        <CardContent className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                    <MapPin className="text-muted-foreground h-5 w-5" />
                    <span>{vaga.city}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Briefcase className="text-muted-foreground h-5 w-5" />
                    <div className="flex gap-2">
                        <Badge variant="secondary">
                            {vaga.schedule === "full time" ? "Integral" : "Meio período"}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <DollarSign className="text-muted-foreground h-5 w-5" />
                    <span>{vaga.salary.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Users className="text-muted-foreground h-5 w-5" />
                    <span>{vaga.number_of_positions}</span>
                </div>
            </div>

            <Separator />

                <section>
                    <h2 className="mb-4 text-xl font-semibold">Descrição da Vaga</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {vaga.description}
                    </p>
                </section>

            <Separator />

            <section>
                <h2 className="mb-4 text-xl font-semibold">Requisitos</h2>
                <p className="text-muted-foreground">{vaga.requirements}</p>
            </section>
        </CardContent>
        </Card>
    );
}