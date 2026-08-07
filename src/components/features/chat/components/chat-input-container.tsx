import React, { useState } from "react";
import { DragOver } from "../drag-over";
import { UploadedFiles } from "../uploaded-files";
import { ChatInputRow } from "./chat-input-row";
import { ChatInputActions } from "./chat-input-actions";
import { SlashCommandMenu } from "./slash-command-menu";
import { useConversationStore } from "#/stores/conversation-store";
import { cn } from "#/utils/utils";
import { SlashCommandItem } from "#/hooks/chat/use-slash-command";

const chatModes = ["Agent", "Ask"] as const;

interface ChatInputContainerProps {
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  isDragOver: boolean;
  disabled: boolean;
  canSubmit: boolean;
  hasStartedConversation?: boolean;
  isNewConversationPending?: boolean;
  showButton: boolean;
  buttonClassName: string;
  chatInputRef: React.RefObject<HTMLDivElement | null>;
  handleFileIconClick: (isDisabled: boolean) => void;
  handleSubmit: () => void;
  onDragOver: (e: React.DragEvent, isDisabled: boolean) => void;
  onDragLeave: (e: React.DragEvent, isDisabled: boolean) => void;
  onDrop: (e: React.DragEvent, isDisabled: boolean) => void;
  onInput: () => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isSlashMenuOpen?: boolean;
  slashItems?: SlashCommandItem[];
  slashSelectedIndex?: number;
  onSlashSelect?: (item: SlashCommandItem) => void;
}

export function ChatInputContainer({
  chatContainerRef,
  isDragOver,
  disabled,
  canSubmit,
  hasStartedConversation,
  isNewConversationPending = false,
  showButton,
  buttonClassName,
  chatInputRef,
  handleFileIconClick,
  handleSubmit,
  onDragOver,
  onDragLeave,
  onDrop,
  onInput,
  onPaste,
  onKeyDown,
  onFocus,
  onBlur,
  isSlashMenuOpen = false,
  slashItems = [],
  slashSelectedIndex = 0,
  onSlashSelect,
}: ChatInputContainerProps) {
  const conversationMode = useConversationStore(
    (state) => state.conversationMode,
  );
  const [mode, setMode] = useState<"Agent" | "Ask">("Agent");
  const placeholder =
    mode === "Agent"
      ? "Ask AI to build features, fix bugs, or work on your code"
      : "Ask AI a question about your codebase";

  return (
    <>
      <div className="relative w-full">
        <img
          src="/cohet-mascot.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-full right-2 z-10 h-24 w-24 object-contain md:right-4 md:h-28 md:w-28"
        />

        <div
          ref={chatContainerRef}
          className={cn(
            "chat-input-reference relative box-border flex min-h-[15vh] w-full flex-col items-start justify-between overflow-visible rounded-[20px] border border-white/[0.07] bg-[#1f1f1f] p-[14px_14px_10px] shadow-[0_16px_40px_-18px_rgba(0,0,0,0.7)] md:min-h-0",
            conversationMode === "plan" && "border-[#597FF4]",
          )}
          onDragOver={(e) => onDragOver(e, disabled)}
          onDragLeave={(e) => onDragLeave(e, disabled)}
          onDrop={(e) => onDrop(e, disabled)}
        >
          {/* Drag Over UI */}
          {isDragOver && <DragOver />}

          <UploadedFiles />

          {/* Wrapper so the slash menu anchors just above the input row,
            not above the entire (possibly resized) container */}
          <div className="relative w-full p-0">
            {isSlashMenuOpen && onSlashSelect && (
              <SlashCommandMenu
                items={slashItems}
                selectedIndex={slashSelectedIndex}
                onSelect={onSlashSelect}
              />
            )}

            <ChatInputRow
              chatInputRef={chatInputRef}
              isNewConversationPending={isNewConversationPending}
              placeholder={placeholder}
              onInput={onInput}
              onPaste={onPaste}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          <ChatInputActions
            disabled={disabled}
            canSubmit={canSubmit}
            hasStartedConversation={hasStartedConversation}
            onAddFileClick={() => handleFileIconClick(disabled)}
            showButton={showButton}
            buttonClassName={buttonClassName}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>

      <div className="mt-3 flex w-full justify-center">
        <div className="flex rounded-full border border-white/[0.07] bg-[#1f1f1f] p-0.5">
          {chatModes.map((option) => (
            <button
              key={option}
              type="button"
              className={cn(
                "rounded-full border-0 px-4 py-1 text-[13px] font-semibold transition-colors",
                mode === option
                  ? "bg-[#232323] text-[#f2f2f2]"
                  : "bg-transparent text-[#949494]",
              )}
              onClick={() => setMode(option)}
              disabled={disabled}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
