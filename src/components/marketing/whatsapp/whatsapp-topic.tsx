'use client';

import { FC, useEffect } from 'react';

import { useWhatsApp } from './whatsapp-provider';

interface Props {
  project: string;
}

const WhatsAppTopic: FC<Props> = ({ project }) => {
  const { setProject } = useWhatsApp();

  useEffect(() => {
    setProject(project);
    return () => setProject(null);
  }, [project, setProject]);

  return null;
};

export default WhatsAppTopic;
