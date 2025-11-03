"use client";
import { AuthProvider, useAuth } from "@/context/AuthContext";   
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
                className="block w-full text-left text-red-600 hover:text-red-700 text-base"
            >
                {loading ? "Saindo..." : "Sair"}
            </button>
        );
    }

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 w-full text-left text-base"
        >
            <LogOut className="w-4 h-4" />
            {loading ? "Saindo..." : "Sair"}
        </button>
    );
}