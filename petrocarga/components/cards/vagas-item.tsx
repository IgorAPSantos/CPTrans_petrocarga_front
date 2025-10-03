import { Vaga } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

type VagaItemProp = {
    vaga: Vaga;
};

export default function VagaItem({ vaga }: VagaItemProp) {
    return (
        <article className="grid w-full grid-cols-6 items-center border border-t-4 border-black bg-white px-6 py-4 shadow transition-colors hover:border-blue-400">
        <h3 className="font-display col-span-2 overflow-hidden text-lg font-medium text-ellipsis whitespace-nowrap text-gray-700">
            {vaga.title}
        </h3>
        <h4 className="overflow-hidden font-light text-gray-500">
            {vaga.company}
        </h4>
        <h4 className="font-light text-gray-500">
            {vaga.city}
        </h4>
        <h4 className="font-light text-gray-500">
            R$ {vaga.salary.toFixed(2)}
        </h4>
        <Link
            href={`/visualizar-vagas/${vaga.id}`}
            className={cn(buttonVariants({ variant: "outline" }))}
        >
            Mais
        </Link>
        </article>
    );
}