import { Github, Instagram, Mail, } from "lucide-react";
import Logo from "./logo";

export default function Footer() {
    return (
        <footer className="bg-black py-10 text-white">
            <div className="mx-auto max-w-5xl flex justify-between">
                <div className="max-w-sm">
                    <Logo bg="dark"/>
                    <p className="text-sm font-extralight mt-2">
                        O CodanteVagas conecta candidatos a empregos ideais, oferecendo 
                        funcionalidades intuitivas para busca er gerencaimento de vagas
                    </p>
                </div>
                <div className="flex gap-3">
                    <Instagram className="cursor-pointer hover:text-blue-400"/>
                    <Github className="cursor-pointer hover:text-blue-400"/>
                    <Mail className="cursor-pointer hover:text-blue-400"/>
                </div>
            </div>
        </footer>
    )
}