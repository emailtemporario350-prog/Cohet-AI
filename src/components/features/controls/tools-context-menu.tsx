import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useClickOutsideElement } from "#/hooks/use-click-outside-element";
import { useActiveConversation } from "#/hooks/query/use-active-conversation";
import { useUserProviders } from "#/hooks/use-user-providers";
import { cn } from "#/utils/utils";
import { ContextMenu } from "#/ui/context-menu";
import { ContextMenuListItem } from "../context-menu/context-menu-list-item";
import { Divider } from "#/ui/divider";
import { I18nKey } from "#/i18n/declaration";

import CodeBranchIcon from "#/icons/u-code-branch.svg?react";
import SkillsIcon from "#/icons/skills.svg?react";
import PuzzleIcon from "#/icons/u-puzzle-piece.svg?react";
import FishingHookIcon from "#/icons/fishing-hook.svg?react";
import ToolsIcon from "#/icons/u-tools.svg?react";
import RobotIcon from "#/icons/u-robot.svg?react";
import SettingsIcon from "#/icons/settings.svg?react";
import CarretRightFillIcon from "#/icons/carret-right-fill.svg?react";
import { ToolsContextMenuIconText } from "./tools-context-menu-icon-text";
import { GitToolsSubmenu } from "./git-tools-submenu";
import { MacrosSubmenu } from "./macros-submenu";
import { ChatInputProfileMenuContent } from "#/components/features/chat/components/chat-input-profile-picker";
import { ArchivedDisabledTooltip } from "../context-menu/archived-disabled-tooltip";
import { useIsArchivedConversation } from "#/hooks/use-is-archived-conversation";

export const OPERATING_SYSTEMS = ["Ubuntu", "Windows 11", "Debian"] as const;
export type OperatingSystem = (typeof OPERATING_SYSTEMS)[number];

const OPERATING_SYSTEM_LOGOS: Record<OperatingSystem, string> = {
  Ubuntu: "/brands/ubuntu.svg",
  "Windows 11": "/brands/windows.svg",
  Debian: "/brands/debian.svg",
};

function OperatingSystemIcon({ name }: { name: OperatingSystem }) {
  return (
    <img
      src={OPERATING_SYSTEM_LOGOS[name]}
      alt=""
      aria-hidden="true"
      className="size-3 object-contain brightness-0 invert"
    />
  );
}

interface ToolsContextMenuProps {
  onClose: () => void;
  onShowSkills: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onShowPlugins: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onShowHooks: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onShowAgentTools: (event: React.MouseEvent<HTMLButtonElement>) => void;
  shouldShowAgentTools?: boolean;
  shouldShowHooks?: boolean;
  shouldShowPlugins?: boolean;
  /**
   * Offer the "Switch agent profile" submenu (OSS-5735). The caller owns the
   * gating (pre-start only + profiles available) so this menu stays renderable
   * without query/navigation providers when the item is off.
   */
  showAgentProfileSwitch?: boolean;
  /** When set, renders a divider and this action as the last menu item. */
  footerAction?: {
    testId: string;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  };
  customActions?: Array<{
    testId: string;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }>;
  operatingSystem?: OperatingSystem;
  onOperatingSystemChange?: (operatingSystem: OperatingSystem) => void;
}

export function ToolsContextMenu({
  onClose,
  onShowSkills,
  onShowPlugins,
  onShowHooks,
  onShowAgentTools,
  shouldShowAgentTools = true,
  shouldShowHooks = false,
  shouldShowPlugins = false,
  showAgentProfileSwitch = false,
  footerAction,
  customActions = [],
  operatingSystem = "Ubuntu",
  onOperatingSystemChange,
}: ToolsContextMenuProps) {
  const { t } = useTranslation("openhands");
  const { data: conversation } = useActiveConversation();
  const { providers } = useUserProviders();
  const isArchivedConversation = useIsArchivedConversation();

  const [activeSubmenu, setActiveSubmenu] = useState<
    "git" | "macros" | "agent-profile" | null
  >(null);
  const [operatingSystemOpen, setOperatingSystemOpen] = useState(false);

  const hasRepository = !!conversation?.selected_repository;
  const providersAreSet = providers.length > 0;
  const showGitTools = hasRepository && providersAreSet;

  const handleSubmenuClick = (submenu: "git" | "macros" | "agent-profile") => {
    if (isArchivedConversation) {
      return;
    }
    setActiveSubmenu(activeSubmenu === submenu ? null : submenu);
  };

  const handleClose = () => {
    setActiveSubmenu(null);
    onClose();
  };

  const ref = useClickOutsideElement<HTMLUListElement>(handleClose);

  return (
    <ContextMenu
      ref={ref}
      testId="tools-context-menu"
      position="top"
      alignment="left"
      className="left-[-10px] bottom-full mb-2 min-w-[185px] overflow-visible border-white/[0.1] bg-[#141414]/90 p-0.5 text-[11px] shadow-[0_18px_50px_-16px_rgba(0,0,0,0.85)] backdrop-blur-xl [&>button]:gap-1.5 [&>button]:px-1.5 [&>button]:py-1 [&>button]:text-[11px] [&>button]:leading-4 [&_.text-sm]:text-[11px] [&_.text-sm]:leading-4 [&_svg]:size-3"
    >
      {/* Switch agent profile — only while starting a new conversation; the
          profile is locked once the conversation starts (OSS-5735). Selecting
          a profile activates it (home) or recreates the blank conversation
          with it (see ChatInputProfileMenuContent). No archived gating: this
          never renders in a started (archivable) conversation. */}
      {showAgentProfileSwitch && (
        <div className="relative group/agent-profile">
          <ContextMenuListItem
            testId="switch-agent-profile-button"
            onClick={() => handleSubmenuClick("agent-profile")}
          >
            <ToolsContextMenuIconText
              icon={<RobotIcon width={16} height={16} aria-hidden />}
              text={t(I18nKey.CHAT$SWITCH_AGENT_PROFILE)}
              rightIcon={<CarretRightFillIcon width={10} height={10} />}
            />
          </ContextMenuListItem>
          <div
            className={cn(
              "absolute left-full top-[-4px] z-60 opacity-0 invisible pointer-events-none transition-all duration-200 ml-[1px]",
              "group-hover/agent-profile:opacity-100 group-hover/agent-profile:visible group-hover/agent-profile:pointer-events-auto",
              "hover:opacity-100 hover:visible hover:pointer-events-auto",
              activeSubmenu === "agent-profile" &&
                "opacity-100 visible pointer-events-auto",
            )}
          >
            {/* overflow-y-auto so a long profile list scrolls within the menu;
                safe because the content has no floating children — only the
                flat profile list + Manage link. */}
            <ContextMenu
              testId="agent-profile-submenu"
              className="min-w-[220px] max-w-[320px] max-h-[60vh] overflow-y-auto gap-0"
            >
              <ChatInputProfileMenuContent
                onClose={handleClose}
                dividerInset="menu"
              />
            </ContextMenu>
          </div>
        </div>
      )}

      {/* Git Tools */}
      {showGitTools && (
        <div className="relative group/git">
          <ArchivedDisabledTooltip isDisabled={isArchivedConversation}>
            <ContextMenuListItem
              testId="git-tools-button"
              onClick={() => handleSubmenuClick("git")}
              isDisabled={isArchivedConversation}
            >
              <ToolsContextMenuIconText
                icon={<CodeBranchIcon width={16} height={16} />}
                text={t(I18nKey.COMMON$GIT_TOOLS)}
                rightIcon={<CarretRightFillIcon width={10} height={10} />}
              />
            </ContextMenuListItem>
          </ArchivedDisabledTooltip>
          {!isArchivedConversation && (
            <div
              className={cn(
                "absolute left-full top-[-6px] z-60 opacity-0 invisible pointer-events-none transition-all duration-200 ml-[1px]",
                "group-hover/git:opacity-100 group-hover/git:visible group-hover/git:pointer-events-auto",
                "hover:opacity-100 hover:visible hover:pointer-events-auto",
                activeSubmenu === "git" &&
                  "opacity-100 visible pointer-events-auto",
              )}
            >
              <GitToolsSubmenu onClose={handleClose} />
            </div>
          )}
        </div>
      )}

      {/* Macros */}
      <div className="relative group/macros">
        <ArchivedDisabledTooltip isDisabled={isArchivedConversation}>
          <ContextMenuListItem
            testId="macros-button"
            onClick={() => handleSubmenuClick("macros")}
            isDisabled={isArchivedConversation}
          >
            <ToolsContextMenuIconText
              icon={<SettingsIcon width={16} height={16} />}
              text={t(I18nKey.COMMON$MACROS)}
              rightIcon={<CarretRightFillIcon width={10} height={10} />}
            />
          </ContextMenuListItem>
        </ArchivedDisabledTooltip>
        {!isArchivedConversation && (
          <div
            className={cn(
              "absolute left-full top-[-4px] z-60 opacity-0 invisible pointer-events-none transition-all duration-200 ml-[1px]",
              "group-hover/macros:opacity-100 group-hover/macros:visible group-hover/macros:pointer-events-auto",
              "hover:opacity-100 hover:visible hover:pointer-events-auto",
              activeSubmenu === "macros" &&
                "opacity-100 visible pointer-events-auto",
            )}
          >
            <MacrosSubmenu onClose={handleClose} />
          </div>
        )}
      </div>

      {customActions.length > 0 && <Divider inset="menu" />}
      {customActions.map((action) => (
        <ContextMenuListItem
          key={action.testId}
          testId={action.testId}
          onClick={action.onClick}
        >
          <ToolsContextMenuIconText icon={action.icon} text={action.label} />
        </ContextMenuListItem>
      ))}

      <Divider inset="menu" />
      <div className="relative">
        <ContextMenuListItem
          testId="operating-system-menu-button"
          onClick={() => setOperatingSystemOpen((open) => !open)}
        >
          <ToolsContextMenuIconText
            icon={<OperatingSystemIcon name={operatingSystem} />}
            text={operatingSystem}
            rightIcon={<ChevronDown size={12} strokeWidth={1.5} />}
          />
        </ContextMenuListItem>
        {operatingSystemOpen && (
          <div className="mx-1 mb-1 rounded-md border border-white/[0.08] bg-black/20 p-0.5">
            {OPERATING_SYSTEMS.map((option) => (
              <button
                key={option}
                type="button"
                className="flex w-full items-center justify-between gap-2 rounded px-1.5 py-1 text-left text-[11px] text-[#b8b8b8] transition-colors hover:bg-white/[0.06] hover:text-white"
                onClick={() => {
                  onOperatingSystemChange?.(option);
                  setOperatingSystemOpen(false);
                }}
              >
                <span className="flex items-center gap-1.5">
                  <OperatingSystemIcon name={option} />
                  {option}
                </span>
                {operatingSystem === option && (
                  <Check size={11} className="text-[#949494]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {shouldShowAgentTools && <Divider inset="menu" />}

      <ArchivedDisabledTooltip isDisabled={isArchivedConversation}>
        <ContextMenuListItem
          testId="show-skills-button"
          onClick={onShowSkills}
          isDisabled={isArchivedConversation}
        >
          <ToolsContextMenuIconText
            icon={
              <SkillsIcon
                width={16}
                height={16}
                className="stroke-[1.75]"
                aria-hidden
              />
            }
            text={t(I18nKey.CONVERSATION$SHOW_SKILLS)}
          />
        </ContextMenuListItem>
      </ArchivedDisabledTooltip>

      {/* Show Plugins - only when this conversation has attached plugins */}
      {shouldShowPlugins && (
        <ArchivedDisabledTooltip isDisabled={isArchivedConversation}>
          <ContextMenuListItem
            testId="show-plugins-button"
            onClick={onShowPlugins}
            isDisabled={isArchivedConversation}
          >
            <ToolsContextMenuIconText
              icon={<PuzzleIcon width={16} height={16} aria-hidden />}
              text={t(I18nKey.CONVERSATION$SHOW_PLUGINS)}
            />
          </ContextMenuListItem>
        </ArchivedDisabledTooltip>
      )}

      {/* Show Hooks - Only show for V1 conversations */}
      {shouldShowHooks && (
        <ArchivedDisabledTooltip isDisabled={isArchivedConversation}>
          <ContextMenuListItem
            testId="show-hooks-button"
            onClick={onShowHooks}
            isDisabled={isArchivedConversation}
          >
            <ToolsContextMenuIconText
              icon={<FishingHookIcon width={16} height={16} aria-hidden />}
              text={t(I18nKey.CONVERSATION$SHOW_HOOKS)}
            />
          </ContextMenuListItem>
        </ArchivedDisabledTooltip>
      )}

      {/* Show Agent Tools and Metadata - Only show if system message is available */}
      {shouldShowAgentTools && (
        <ArchivedDisabledTooltip isDisabled={isArchivedConversation}>
          <ContextMenuListItem
            testId="show-agent-tools-button"
            onClick={onShowAgentTools}
            isDisabled={isArchivedConversation}
          >
            <ToolsContextMenuIconText
              icon={<ToolsIcon width={16} height={16} />}
              text={t(I18nKey.BUTTON$SHOW_AGENT_TOOLS_AND_METADATA)}
            />
          </ContextMenuListItem>
        </ArchivedDisabledTooltip>
      )}

      {footerAction && (
        <>
          <Divider />
          <ContextMenuListItem
            testId={footerAction.testId}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              footerAction.onClick();
              handleClose();
            }}
          >
            <ToolsContextMenuIconText
              icon={footerAction.icon}
              text={footerAction.label}
            />
          </ContextMenuListItem>
        </>
      )}
    </ContextMenu>
  );
}
