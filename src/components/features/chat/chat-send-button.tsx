import { ArrowUp } from "lucide-react";
import { cn } from "#/utils/utils";

export interface ChatSendButtonProps {
  buttonClassName: string;
  handleSubmit: () => void;
  disabled: boolean;
}

export function ChatSendButton({
  buttonClassName,
  handleSubmit,
  disabled,
}: ChatSendButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex size-9 items-center justify-center rounded-full border-0 bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        buttonClassName,
      )}
      data-name="arrow-up-circle-fill"
      data-testid="submit-button"
      onClick={handleSubmit}
      disabled={disabled}
    >
      <ArrowUp className="size-[18px]" strokeWidth={2} />
    </button>
  );
}
