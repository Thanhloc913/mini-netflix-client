import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  color: string;
  onClick?: () => void;
}

export default function ActionCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  color,
  onClick 
}: ActionCardProps) {
  const cardContent = (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-gray-750 transition-colors group">
      <div className="flex items-start">
        <div className={`${color} p-3 rounded-lg transition-colors flex-shrink-0`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 truncate">
            {title}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {description}
          </p>
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