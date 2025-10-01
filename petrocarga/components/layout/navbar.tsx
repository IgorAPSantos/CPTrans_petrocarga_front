import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between max-w-5xl py-6 w-full">
            <Link className="flex items-center space-x-2" href={""}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                    <span className="text-lg font-bold text-primary-foreground">CP</span>
                </div>
                <span className="text-xl font-bold text-foreground">CPTrans</span>
            </Link>
            <ul className="flex items-center gap-6">
                <Link href="/" className={cn(buttonVariants({ variant: "link" }))}>
                    Cadastrar Vagas
                </Link>
                <Link href="/sobre" className={cn(buttonVariants({ variant: "link" }))}>
                    Visualizar Vagas
                </Link>
                <Link href="/vagas" className={cn(buttonVariants({ variant: "link" }))}>
                    Uso das Vagas  
                </Link>
            </ul>
        </nav>
    )
}