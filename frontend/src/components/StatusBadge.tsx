import React from 'react';
import { Badge, BadgeVariant } from '@/components/ui/Badge';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let variant: BadgeVariant = 'default';
  
  switch (status) {
    case 'OPEN':
      variant = 'info';
      break;
    case 'IN_PROGRESS':
      variant = 'warning';
      break;
    case 'RESOLVED':
      variant = 'success';
      break;
    case 'CLOSED':
      variant = 'default';
      break;
  }

  return (
    <Badge variant={variant}>
      {status.replace('_', ' ')}
    </Badge>
  );
};

export const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  let variant: BadgeVariant = 'default';
  
  switch (priority) {
    case 'LOW':
      variant = 'default';
      break;
    case 'MEDIUM':
      variant = 'info';
      break;
    case 'HIGH':
      variant = 'warning';
      break;
    case 'URGENT':
      variant = 'error';
      break;
  }

  return (
    <Badge variant={variant}>
      {priority}
    </Badge>
  );
};
