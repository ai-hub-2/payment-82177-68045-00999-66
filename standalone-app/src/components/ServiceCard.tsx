import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  titleAr: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
}

const ServiceCard = ({
  title,
  titleAr,
  description,
  icon: Icon,
  href,
  gradient,
}: ServiceCardProps) => {
  return (
    <Link to={href}>
      <div className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary transition-all duration-300 hover:shadow-elevated cursor-pointer h-full">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{ background: gradient }}
        />
        
        <div className="relative p-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
            style={{ background: gradient }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          
          <h3 className="text-base font-bold mb-1 group-hover:text-primary transition-colors">
            {titleAr}
          </h3>
          <p className="text-xs text-muted-foreground mb-1">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
