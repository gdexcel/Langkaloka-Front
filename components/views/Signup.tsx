import { GalleryVerticalEnd } from "lucide-react";
import { SignupForm } from "./fragments/SignupForm";

type Props = {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
};

export default function SignupPage({ onSuccess, onSwitchToLogin }: Props) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <a href="#" className="flex items-center gap-2 self-center font-medium">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        LangkaLoka.
      </a>

      <SignupForm onSuccess={onSuccess} onSwitchToLogin={onSwitchToLogin} />
    </div>
  );
}
