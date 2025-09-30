'use client';

import React from 'react';
import { Bug } from 'lucide-react';
import { useBlario } from '../hooks/useBlario';
import { useBlarioContext } from '../provider/BlarioProvider';
import { Button } from './components/button';
import { cn } from './lib/utils';

export interface IssueReporterButtonProps {
  variant?: 'floating' | 'inline';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
  children?: React.ReactNode;
  category?: string;
  prefill?: Record<string, any>;
  'aria-label'?: string;
}

export function IssueReporterButton({
  variant = 'floating',
  position,
  className,
  children,
  category,
  prefill,
  'aria-label': ariaLabel = 'Report an issue',
}: IssueReporterButtonProps) {
  const { openReporter } = useBlario();
  const { config } = useBlarioContext();

  const finalPosition = position ?? config.theme?.position ?? 'bottom-right';

  const handleClick = () => {
    openReporter({ category, prefill });
  };

  if (variant === 'inline') {
    return (
      <Button
        onClick={handleClick}
        className={cn('blario-button-inline', className)}
        aria-label={ariaLabel}
      >
        <Bug className="blario-button-icon-inline" />
        <span className="blario-button-text">{children ?? 'Report Issue'}</span>
      </Button>
    );
  }

  const positionClasses: Record<string, string> = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        'fixed z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all',
        positionClasses[finalPosition],
        config.theme?.accent && `bg-[${config.theme.accent}]`,
        className
      )}
      size="icon"
      aria-label={ariaLabel}
    >
      <Bug className="h-6 w-6" />
    </Button>
  );
}