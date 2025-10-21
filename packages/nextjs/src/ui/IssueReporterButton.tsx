'use client';

import React from 'react';
import { Bug } from 'lucide-react';
import { useBlario } from '../hooks/useBlario';
import { useBlarioContext } from '../provider/BlarioProvider';
import { Button } from './components/button';
import { cn } from './lib/utils';
import type { ChatHistoryMessage } from '@blario/core';

// Types
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';
export type ButtonPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export type ButtonDisplayVariant = 'floating' | 'inline';

export interface IssueReporterButtonProps {
  // Display options
  variant?: ButtonDisplayVariant;
  position?: ButtonPosition;
  unstyled?: boolean;

  // Styling
  className?: string;
  buttonVariant?: ButtonVariant;
  buttonSize?: ButtonSize;

  // Content customization
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconClassName?: string;
  textClassName?: string;
  hideIcon?: boolean;
  hideText?: boolean;

  // Behavior
  category?: string;
  chatHistory?: ChatHistoryMessage[];
  'aria-label'?: string;
}

// Constants
const POSITION_CLASSES: Record<ButtonPosition, string> = {
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
};

const DEFAULT_FLOATING_CLASSES = 'fixed z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all';
const DEFAULT_ICON_SIZE = 'h-6 w-6';
const DEFAULT_ARIA_LABEL = 'Report an issue';
const DEFAULT_TEXT = 'Report Issue';

// Subcomponents
interface ButtonContentProps {
  icon?: React.ReactNode;
  hideIcon?: boolean;
  hideText?: boolean;
  iconClassName?: string;
  textClassName?: string;
  children?: React.ReactNode;
  isStyled?: boolean;
  isInline?: boolean;
}

const ButtonContent: React.FC<ButtonContentProps> = ({
  icon,
  hideIcon,
  hideText,
  iconClassName,
  textClassName,
  children,
  isStyled = false,
  isInline = false,
}) => {
  const iconElement = !hideIcon && (
    icon || (
      <Bug
        className={
          isStyled && isInline
            ? cn('blario-button-icon-inline', iconClassName)
            : iconClassName || DEFAULT_ICON_SIZE
        }
      />
    )
  );

  const textElement = !hideText && (
    children || DEFAULT_TEXT
  );

  if (!textElement) {
    return <>{iconElement}</>;
  }

  const textWrapper = isStyled && isInline ? (
    <span className={cn('blario-button-text', textClassName)}>
      {textElement}
    </span>
  ) : (
    <span className={textClassName}>{textElement}</span>
  );

  return (
    <>
      {iconElement}
      {textWrapper}
    </>
  );
};

// Main component
export function IssueReporterButton({
  // Display options
  variant = 'floating',
  position,
  unstyled = false,

  // Styling
  className,
  buttonVariant,
  buttonSize,

  // Content customization
  children,
  icon,
  iconClassName,
  textClassName,
  hideIcon = false,
  hideText = false,

  // Behavior
  category,
  chatHistory,
  'aria-label': ariaLabel = DEFAULT_ARIA_LABEL,
}: IssueReporterButtonProps) {
  const { openReporter } = useBlario();
  const { config } = useBlarioContext();

  const finalPosition = position ?? config.theme?.position ?? 'bottom-right';

  const handleClick = React.useCallback(() => {
    openReporter({ category, chatHistory });
  }, [openReporter, category, chatHistory]);

  const contentProps: ButtonContentProps = {
    icon,
    hideIcon,
    hideText,
    iconClassName,
    textClassName,
    children,
    isStyled: !unstyled,
    isInline: variant === 'inline',
  };

  // Unstyled button (complete control)
  if (unstyled) {
    const baseClasses = variant === 'floating'
      ? cn('fixed z-50', POSITION_CLASSES[finalPosition])
      : undefined;

    return (
      <button
        onClick={handleClick}
        className={cn(baseClasses, className)}
        aria-label={ariaLabel}
        data-tour-id="issue-reporter-button"
      >
        <ButtonContent {...contentProps} />
      </button>
    );
  }

  // Inline styled button
  if (variant === 'inline') {
    return (
      <Button
        onClick={handleClick}
        className={cn('blario-button-inline', className)}
        aria-label={ariaLabel}
        variant={buttonVariant}
        size={buttonSize}
        data-tour-id="issue-reporter-button"
      >
        <ButtonContent {...contentProps} />
      </Button>
    );
  }

  // Floating styled button - icon only by default
  return (
    <Button
      onClick={handleClick}
      className={cn(
        DEFAULT_FLOATING_CLASSES,
        POSITION_CLASSES[finalPosition],
        config.theme?.accent && `bg-[${config.theme.accent}]`,
        className
      )}
      size={buttonSize || 'icon'}
      variant={buttonVariant}
      aria-label={ariaLabel}
      data-tour-id="issue-reporter-button"
    >
      <ButtonContent {...contentProps} hideText={hideText === undefined ? true : hideText} />
    </Button>
  );
}