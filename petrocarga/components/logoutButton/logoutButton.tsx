"use client";
import { useAuth } from "../hooks/useAuth";
import { redirect } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

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
                disabled={loading}
                className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
                <LogOut className="h-4 w-4" />
                {loading ? "Saindo..." : "Sair"}
            </button>
        );
    }

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
            <LogOut className="h-4 w-4" />
            {loading ? "Saindo..." : "Sair"}
        </button>
    );
}