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
        "flex size-9 items-center justify-center rounded-full border-0 bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-[#2a2a2a] dark:text-gray-400 dark:hover:bg-[#333]",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        buttonClassName,
      )}
      data-name="arrow-up-circle-fill"
      data-testid="submit-button"
      onClick={handleSubmit}
      disabled={disabled}
    >
      <Mic className="size-[18px]" strokeWidth={2} />
    </button>
  );
}
