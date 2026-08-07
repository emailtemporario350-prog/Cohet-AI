import React from "react";
import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { useConversationStore } from "#/stores/conversation-store";
import { focusContentEditableAtEnd } from "#/components/features/chat/utils/chat-input.utils";
import { cn } from "#/utils/utils";

interface ChatInputFieldProps {
  chatInputRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
  onInput: () => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function ChatInputField({
  chatInputRef,
  disabled = false,
  onInput,
  onPaste,
  onKeyDown,
  onFocus,
  onBlur,
}: ChatInputFieldProps) {
  const { t } = useTranslation("openhands");

  const conversationMode = useConversationStore(
    (state) => state.conversationMode,
  );

  const isPlanMode = conversationMode === "plan";

  React.useEffect(() => {
    if (!disabled) {
      focusContentEditableAtEnd(chatInputRef.current);
    }
    // Focus on mount only — re-focusing on later `disabled` transitions
    // would steal focus from a user who has clicked elsewhere.
  }, []);

  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-start min-h-6 p-0 relative shrink-0 flex-1"
      data-name="Text & caret"
    >
      <div className="basis-0 flex flex-col font-normal grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[var(--oh-text-tertiary)] text-[16px] text-left">
        <div
          ref={chatInputRef}
          className={cn(
            "chat-input chat-input-reference-field block min-h-[44px] max-h-[240px] w-full resize-none whitespace-pre-wrap bg-transparent px-4 pt-3 text-base font-normal leading-[1.3] text-primary outline-none [text-overflow:inherit] [text-wrap-mode:inherit] [white-space-collapse:inherit] custom-scrollbar",
            disabled && "cursor-not-allowed opacity-50",
          )}
          contentEditable={!disabled}
          data-placeholder={
            isPlanMode
              ? t(I18nKey.COMMON$LET_S_WORK_ON_A_PLAN)
              : t(I18nKey.SUGGESTIONS$WHAT_TO_BUILD)
          }
          data-testid="chat-input"
          onInput={onInput}
          onPaste={onPaste}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
}
