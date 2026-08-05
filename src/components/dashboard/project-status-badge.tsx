import { FC } from 'react';

import Badge from '@/components/ui/badge';

const ProjectStatusBadge: FC<{ isActive: boolean; className?: string }> = ({
  isActive,
  className,
}) => (
  <Badge tone={isActive ? 'green' : 'red'} className={className}>
    {isActive ? 'Active' : 'Inactive'}
  </Badge>
);

export default ProjectStatusBadge;
