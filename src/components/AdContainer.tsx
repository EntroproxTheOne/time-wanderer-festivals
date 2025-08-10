import { Card } from '@/components/ui/card';

interface AdContainerProps {
  type: 'horizontal' | 'rectangle';
  className?: string;
}

export const AdContainer = ({ type, className = '' }: AdContainerProps) => {
  const dimensions = type === 'horizontal' 
    ? 'h-20 w-full' 
    : 'h-48 w-64';

  return (
    <Card className={`ad-container ${dimensions} ${className} border-dashed border-2 border-muted flex items-center justify-center bg-muted/10`}>
      <div className="text-center text-muted-foreground">
        <div className="text-xs uppercase tracking-wide font-medium">Advertisement</div>
        <div className="text-xs mt-1">{type === 'horizontal' ? '728×90' : '300×250'}</div>
      </div>
    </Card>
  );
};