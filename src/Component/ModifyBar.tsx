import { Button } from "./Button";
import { ButtonVariant } from "../Util/ButtonTypes";

interface ModifyBarProps {
  onSelectTab: (tab: "modify" | "clear") => void;
  activeTab: "modify" | "clear";
}

export function ModifyBar({ onSelectTab, activeTab }: ModifyBarProps) {
  return (
    <div className="flex flex-col space-y-4">
      <Button
        variant={
          activeTab === "modify"
            ? ButtonVariant.Active
            : ButtonVariant.NonActive
        }
        onClick={() => onSelectTab("modify")}
        className="text-left py-2 px-4"
      >
        Modify Component
      </Button>
      <Button
        variant={
          activeTab === "clear" ? ButtonVariant.Active : ButtonVariant.NonActive
        }
        onClick={() => onSelectTab("clear")}
        className="text-left py-2 px-4"
      >
        Clear Database
      </Button>
    </div>
  );
}
