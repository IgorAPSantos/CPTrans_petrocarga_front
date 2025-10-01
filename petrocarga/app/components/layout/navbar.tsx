import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import Logo from "./logo";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between max-w-5xl py-6 w-full">
            <Logo className=""/>
            <ul className="flex items-center gap-6">
                <Link href="/" className={cn(buttonVariants({ variant: "link" }))}>
                    Home
                </Link>
                <Link href="/sobre" className={cn(buttonVariants({ variant: "link" }))}>
                    Sobre
                </Link>
                <Link href="/vagas" className={cn(buttonVariants({ variant: "link" }))}>
                    Vagas  
                </Link>
                <Link href="/vagas/cadastro" className={cn(buttonVariants({ variant: "link" }))}>
                    Cadastrar Vagas
                </Link>
            </ul>
        </nav>
    )
}