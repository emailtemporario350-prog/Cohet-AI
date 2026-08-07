import React from "react";
import {
  BookOpen,
  FileCode2,
  FolderGit2,
  KeyRound,
  Paperclip,
  Plus,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { cn } from "#/utils/utils";
import { chatInputIconButtonClassName } from "#/utils/form-control-classes";
import { useOptionalConversationId } from "#/hooks/use-conversation-id";
import { useActiveConversation } from "#/hooks/query/use-active-conversation";
import { useConversationNameContextMenu } from "#/hooks/use-conversation-name-context-menu";
import { ToolsContextMenu } from "#/components/features/controls/tools-context-menu";
import { SystemMessageModal } from "#/components/features/conversation-panel/system-message-modal";
import { SkillsModal } from "#/components/features/conversation-panel/skills-modal";
import { PluginsModal } from "#/components/features/conversation-panel/plugins-modal";
import { HooksModal } from "#/components/features/conversation-panel/hooks-modal";

export interface ChatAddFileButtonProps {
  handleFileIconClick: () => void;
  disabled?: boolean;
  className?: string;
  /**
   * Offer the "Switch agent profile" submenu. Computed by ChatInputActions:
   * only while starting a new conversation (home or a blank conversation) and
   * only when the backend has agent profiles (OSS-5735 — once a conversation
   * starts, the agent profile is locked).
   */
  showAgentProfileSwitch?: boolean;
}

export function ChatAddFileButton({
  handleFileIconClick,
  disabled = false,
  className,
  showAgentProfileSwitch = false,
}: ChatAddFileButtonProps) {
  const { t } = useTranslation("openhands");
  const { conversationId } = useOptionalConversationId();
  const { data: conversation } = useActiveConversation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const {
    handleShowAgentTools,
    handleShowSkills,
    handleShowPlugins,
    handleShowHooks,
    systemModalVisible,
    setSystemModalVisible,
    skillsModalVisible,
    setSkillsModalVisible,
    pluginsModalVisible,
    setPluginsModalVisible,
    hooksModalVisible,
    setHooksModalVisible,
    systemMessage,
    shouldShowAgentTools,
    shouldShowHooks,
    shouldShowPlugins,
  } = useConversationNameContextMenu({
    conversationId: conversationId ?? undefined,
    executionStatus: conversation?.execution_status,
    showOptions: true,
    onContextMenuToggle: setMenuOpen,
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    setMenuOpen((open) => !open);
  };

  const customActions = [
    {
      testId: "repositories-menu-button",
      icon: <FolderGit2 className="size-4" aria-hidden />,
      label: "Repositories",
    },
    {
      testId: "codebase-files-menu-button",
      icon: <FileCode2 className="size-4" aria-hidden />,
      label: "Codebase files",
    },
    {
      testId: "devin-sessions-menu-button",
      icon: <Users className="size-4" aria-hidden />,
      label: "Devin sessions",
    },
    {
      testId: "playbooks-menu-button",
      icon: <BookOpen className="size-4" aria-hidden />,
      label: "Playbooks",
    },
    {
      testId: "secrets-menu-button",
      icon: <KeyRound className="size-4" aria-hidden />,
      label: "Secrets",
    },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          className ?? chatInputIconButtonClassName,
          "relative shrink-0",
          disabled
            ? "cursor-not-allowed text-[var(--oh-text-subtle)]"
            : undefined,
          menuOpen && !disabled && "text-white bg-white/10",
        )}
        aria-label={t(I18nKey.CHAT_INTERFACE$PLUS_MENU)}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        data-testid="chat-plus-button"
        onClick={handleClick}
        disabled={disabled}
      >
        <span className="flex h-full w-full items-center justify-center">
          <Plus className="h-5 w-5 shrink-0" strokeWidth={1.25} />
        </span>
      </button>

      {menuOpen && (
        <ToolsContextMenu
          onClose={() => setMenuOpen(false)}
          showAgentProfileSwitch={showAgentProfileSwitch}
          onShowSkills={handleShowSkills}
          onShowPlugins={handleShowPlugins}
          onShowHooks={handleShowHooks}
          onShowAgentTools={handleShowAgentTools}
          shouldShowAgentTools={shouldShowAgentTools}
          shouldShowHooks={shouldShowHooks}
          shouldShowPlugins={shouldShowPlugins}
          customActions={customActions.map((action) => ({
            ...action,
            onClick: () => setMenuOpen(false),
          }))}
          footerAction={{
            testId: "add-files-and-images-button",
            icon: (
              <Paperclip
                className="h-4 w-4 shrink-0"
                strokeWidth={2}
                aria-hidden
              />
            ),
            label: "Upload attachment",
            onClick: handleFileIconClick,
          }}
        />
      )}

      <SystemMessageModal
        isOpen={systemModalVisible}
        onClose={() => setSystemModalVisible(false)}
        systemMessage={systemMessage || null}
      />
      {skillsModalVisible && (
        <SkillsModal onClose={() => setSkillsModalVisible(false)} />
      )}
      {pluginsModalVisible && (
        <PluginsModal onClose={() => setPluginsModalVisible(false)} />
      )}
      {hooksModalVisible && (
        <HooksModal onClose={() => setHooksModalVisible(false)} />
      )}
    </div>
  );
}
