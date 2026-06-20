import { PackageOpen } from "lucide-react";
import Button from "./Button";

const iconMap = {
  cart: PackageOpen,
  search: PackageOpen,
  orders: PackageOpen,
  default: PackageOpen,
};

const EmptyState = ({ icon = "default", title, description, actionLabel, actionLink, onAction }) => {
  const Icon = iconMap[icon] || iconMap.default;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-secondary" />
      </div>
      <h3 className="text-2xl font-bold text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-secondary max-w-md mb-8">{description}</p>
      )}
      {actionLabel && (actionLink || onAction) && (
        <Button
          variant="primary"
          onClick={onAction}
          {...(actionLink ? { onClick: () => window.location.href = actionLink } : {})}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
