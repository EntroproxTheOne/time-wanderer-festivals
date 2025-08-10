import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface UserSettingsProps {
  onSettingsClick: () => void;
}

export const UserSettings = ({ onSettingsClick }: UserSettingsProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="h-9 w-9 p-0"
      onClick={onSettingsClick}
    >
      <Settings className="h-4 w-4" />
    </Button>
  );
};