import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Mic } from "lucide-react";
import { AgentStatus } from "#/components/features/controls/agent-status";
import { ChangeAgentButton } from "../change-agent-button";
import { ChatInputModel } from "./chat-input-model";
import { ChatInputLlmProfilePicker } from "./chat-input-llm-profile-picker";
import { resolvePickerKind } from "./resolve-picker-kind";
import { ChatAddFileButton } from "../chat-add-file-button";
import { ChatSendButton } from "../chat-send-button";
import { useUnifiedPauseConversation } from "#/hooks/mutation/use-unified-stop-conversation";
import { useOptionalConversationId } from "#/hooks/use-conversation-id";
import { usePauseConversation } from "#/hooks/mutation/use-pause-conversation";
import { useResumeConversation } from "#/hooks/mutation/use-resume-conversation";
import { useActiveBackend } from "#/contexts/active-backend-context";
import { useAgentProfiles } from "#/hooks/query/use-agent-profiles";
import { useChatInputModelState } from "#/hooks/use-chat-input-model-state";

const MODELS = ["Lite", "Swarm", "Normal", "Max", "Ultra"];
const voiceInputLabel = "Voice input";

interface ChatInputActionsProps {
  disabled: boolean;
  canSubmit?: boolean;
  hasStartedConversation?: boolean;
  onAddFileClick?: () => void;
  showButton?: boolean;
  buttonClassName?: string;
  handleSubmit?: () => void;
}

export function ChatInputActions({
  disabled,
  canSubmit = true,
  hasStartedConversation,
  onAddFileClick = () => {},
  showButton = true,
  buttonClassName = "",
  handleSubmit = () => {},
}: ChatInputActionsProps) {
  const unifiedPauseMutation = useUnifiedPauseConversation();
  const pauseConversationMutation = usePauseConversation();
  const resumeConversationMutation = useResumeConversation();
  const { conversationId } = useOptionalConversationId();
  const { backend } = useActiveBackend();
  const modelState = useChatInputModelState();
  const [model, setModel] = useState("Lite");
  const [modelOpen, setModelOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isPreStart = !conversationId || hasStartedConversation === false;
  const agentProfilesForStart = useAgentProfiles({ enabled: isPreStart });
  const showAgentProfileSwitch =
    isPreStart &&
    !(conversationId?.startsWith("task-") ?? false) &&
    (agentProfilesForStart.data?.profiles?.length ?? 0) > 0;
  const pickerKind = resolvePickerKind({ isAcp: modelState.isAcpContext });
  const showChangeAgentButton =
    backend.kind === "cloud" && !modelState.isAcpContext;
  const isPausing =
    unifiedPauseMutation.isPending || pauseConversationMutation.isPending;

  useEffect(() => {
    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setModelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () =>
      document.removeEventListener("mousedown", handleDocumentMouseDown);
  }, []);

  const handlePauseAgent = () => {
    if (conversationId) pauseConversationMutation.mutate({ conversationId });
  };

  const handleResumeAgent = () => {
    if (conversationId) resumeConversationMutation.mutate({ conversationId });
  };

  return (
    <div className="mt-2 flex w-full min-w-0 items-center justify-between gap-2">
      <div className="sr-only">
        {showChangeAgentButton && <ChangeAgentButton />}
        {pickerKind === "model" ? (
          <ChatInputModel />
        ) : (
          <ChatInputLlmProfilePicker />
        )}
      </div>

      <div className="flex min-w-0 items-center gap-0.5">
        <ChatAddFileButton
          disabled={disabled}
          handleFileIconClick={onAddFileClick}
          className="flex size-8 items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#949494] transition-colors hover:bg-[#202020] hover:text-[#f2f2f2]"
          showAgentProfileSwitch={showAgentProfileSwitch}
        />

        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            className="flex items-center gap-1 rounded-md border-0 bg-transparent px-1.5 py-1 text-[13px] font-medium text-[#949494] outline-none transition-colors hover:bg-[#202020] hover:text-[#f2f2f2]"
            aria-expanded={modelOpen}
            aria-haspopup="menu"
            onClick={() => setModelOpen((open) => !open)}
            disabled={disabled}
          >
            {model}
            <ChevronDown size={13} strokeWidth={1.5} />
          </button>

          {modelOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-0 z-20 min-w-[140px] rounded-[10px] border border-white/[0.12] bg-[#161616]/85 p-1 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              {MODELS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="flex w-full items-center justify-between rounded-md border-0 bg-transparent px-2.5 py-1.5 text-left text-[13px] text-[#f2f2f2] transition-colors hover:bg-[#232323]"
                  onClick={() => {
                    setModel(option);
                    setModelOpen(false);
                  }}
                >
                  {option}
                  {model === option && (
                    <Check size={12} className="text-[#FA7D4B]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-0.5">
        {conversationId && (
          <AgentStatus
            handleStop={handlePauseAgent}
            handleResumeAgent={handleResumeAgent}
            disabled={disabled}
            isPausing={isPausing}
          />
        )}
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#949494] transition-colors hover:bg-[#202020] hover:text-[#f2f2f2]"
          aria-label={voiceInputLabel}
        >
          <Mic size={19} strokeWidth={1.5} />
        </button>
        {showButton && (
          <ChatSendButton
            buttonClassName={buttonClassName}
            handleSubmit={handleSubmit}
            disabled={disabled || !canSubmit}
            showDropdown
          />
        )}
      </div>
    </div>
  );
}
