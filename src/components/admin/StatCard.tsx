import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    color: string;
    href?: string;
    description?: string;
    onClick?: () => void;
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    color,
    href,
    description,
    onClick
}: StatCardProps) {
    const cardContent = (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{value}</p>
                    {description && (
                        <p className="text-gray-500 text-xs mt-1">{description}</p>
                    )}
                </div>
                <div className={`${color} p-3 rounded-lg flex-shrink-0`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    );

    if (href) {
        return (
            <Link to={href} className="block">
                {cardContent}
            </Link>
        );
    }

    if (onClick) {
        return (
            <button onClick={onClick} className="block w-full text-left">
                {cardContent}
            </button>
        );
    }

    return cardContent;
}