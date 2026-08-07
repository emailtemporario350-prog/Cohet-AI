import { Mic } from "lucide-react";
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
        "flex size-8 items-center justify-center rounded-full border-0 bg-[#e3e3e3]",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-[#d8d8d8]",
        buttonClassName,
      )}
      data-name="arrow-up-circle-fill"
      data-testid="submit-button"
      onClick={handleSubmit}
      disabled={disabled}
    >
      <Mic className="size-4 text-[#5f6368]" strokeWidth={2} />
    </button>
  );
}
