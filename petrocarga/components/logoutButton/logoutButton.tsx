"use client";
import { useAuth } from "../hooks/useAuth";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

interface LogoutButtonProps {
    mobile?: boolean;
}

export function LogoutButton({ mobile = false }: LogoutButtonProps) {
    const [loading, setLoading] = useState(false);
    const { logout } = useAuth();

    async function handleLogout() {
        setLoading(true);
        await logout();
        redirect("/");
    }

    if (mobile) {
        return (
            <button
                onClick={handleLogout}
                className="block w-full text-left text-white hover:text-white text-base"
            >
                {loading ? "Saindo..." : "Sair"}
            </button>
        );
    }

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer text-white hover:text-white w-full text-left text-base"
        >
            {loading ? "Saindo..." : "Sair"}
        </button>
    );
}