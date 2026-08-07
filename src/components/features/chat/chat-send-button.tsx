import { ArrowUp, ChevronDown } from "lucide-react";
import { cn } from "#/utils/utils";

const submitOptionsLabel = "Submit options";

export interface ChatSendButtonProps {
  buttonClassName: string;
  handleSubmit: () => void;
  disabled: boolean;
  showDropdown?: boolean;
}

export function ChatSendButton({
  buttonClassName,
  handleSubmit,
  disabled,
  showDropdown = false,
}: ChatSendButtonProps) {
  const sendButton = (
    <button
      type="button"
      className={cn(
        "flex h-7 items-center justify-center border-0 p-0 transition-colors",
        showDropdown ? "w-7 rounded-l-full" : "w-9 rounded-full",
        disabled
          ? "cursor-default bg-[#242424] text-[#4a4a4a]"
          : "cursor-pointer bg-[#FA7D4B] text-[#0a0a0a]",
        buttonClassName,
      )}
      data-name="arrow-up-circle-fill"
      data-testid="submit-button"
      onClick={handleSubmit}
      disabled={disabled}
    >
      <ArrowUp className="size-4" strokeWidth={2} />
    </button>
  );

  if (!showDropdown) return sendButton;

  return (
    <div className="ml-1 flex items-center overflow-hidden rounded-full">
      {sendButton}
      <button
        type="button"
        className={cn(
          "flex h-7 w-[18px] items-center justify-center border-0 border-l p-0",
          disabled
            ? "border-white/[0.07] bg-[#242424] text-[#4a4a4a]"
            : "border-black/20 bg-[#FA7D4B] text-[#0a0a0a]",
        )}
        aria-label={submitOptionsLabel}
      >
        <ChevronDown size={13} strokeWidth={1.5} />
      </button>
    </div>
  );
}
