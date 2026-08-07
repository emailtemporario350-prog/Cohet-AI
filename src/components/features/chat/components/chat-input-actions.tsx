import React from "react";
import { Mic } from "lucide-react";
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
  const voiceInputLabel = "Voice input";
  const unifiedPauseMutation = useUnifiedPauseConversation();
  const pauseConversationMutation = usePauseConversation();
  const resumeConversationMutation = useResumeConversation();
  const { conversationId } = useOptionalConversationId();
  const { backend } = useActiveBackend();
  const isCloud = backend.kind === "cloud";
  const modelState = useChatInputModelState();
  // Agent-profile switching lives in the "+" tools menu while the conversation
  // hasn't started (OSS-5735) — the pill itself is always an LLM selector. The
  // gate is computed here (not in the menu) so ToolsContextMenu only mounts the
  // profile submenu when it can actually be used: pre-start, not on a task
  // route, and only when the backend has profiles (#1571 fallback). Fetch is
  // limited to the pre-start window.
  const isPreStart = !conversationId || hasStartedConversation === false;
  const agentProfilesForStart = useAgentProfiles({ enabled: isPreStart });
  const showAgentProfileSwitch =
    isPreStart &&
    !(conversationId?.startsWith("task-") ?? false) &&
    (agentProfilesForStart.data?.profiles?.length ?? 0) > 0;
  // Code/Plan mode switching is a cloud OpenHands feature — it doesn't apply
  // to ACP conversations (which have no "plan" mode), so hide it when ACP.
  const showChangeAgentButton = isCloud && !modelState.isAcpContext;
  const actionsRowRef = React.useRef<HTMLDivElement>(null);
  const rightSectionRef = React.useRef<HTMLDivElement>(null);
  const addFileRef = React.useRef<HTMLDivElement>(null);

  const handlePauseAgent = () => {
    if (!conversationId) return;
    pauseConversationMutation.mutate({ conversationId });
  };

  const handleResumeAgentClick = () => {
    if (!conversationId) return;
    resumeConversationMutation.mutate({ conversationId });
  };

  const isPausing =
    unifiedPauseMutation.isPending || pauseConversationMutation.isPending;

  const showAgentStatusInline = true;

  // Which chat-input LLM picker to show — the constrained ACP model picker or
  // the LLM-profile picker (unit-tested in `resolve-picker-kind.test.ts`).
  const pickerKind = resolvePickerKind({ isAcp: modelState.isAcpContext });

  return (
    <div
      ref={actionsRowRef}
      className="mt-5 flex w-full min-w-0 items-center justify-between gap-2 px-3 pb-3"
    >
      <div className="sr-only">
        {showChangeAgentButton && <ChangeAgentButton />}
        {pickerKind === "model" ? (
          <ChatInputModel />
        ) : (
          <ChatInputLlmProfilePicker />
        )}
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <div ref={addFileRef}>
          <ChatAddFileButton
            disabled={disabled}
            handleFileIconClick={onAddFileClick}
            className="flex size-9 items-center justify-center p-0 text-gray-500 transition-colors hover:text-gray-300 dark:text-gray-500 dark:hover:text-gray-300"
            showAgentProfileSwitch={showAgentProfileSwitch}
          />
        </div>
      </div>
      <div
        ref={rightSectionRef}
        className="ml-auto flex shrink-0 items-center gap-2"
      >
        {showAgentStatusInline && conversationId && (
          <AgentStatus
            handleStop={handlePauseAgent}
            handleResumeAgent={handleResumeAgentClick}
            disabled={disabled}
            isPausing={isPausing}
          />
        )}
        <button
          type="button"
          className="flex size-9 items-center justify-center p-0 text-gray-500 transition-colors hover:text-gray-300 dark:text-gray-500 dark:hover:text-gray-300"
          aria-label={voiceInputLabel}
        >
          <Mic className="size-[18px]" />
        </button>
        {showButton && (
          <ChatSendButton
            buttonClassName={buttonClassName}
            handleSubmit={handleSubmit}
            disabled={disabled || !canSubmit}
          />
        )}
      </div>
    </div>
  );
}
