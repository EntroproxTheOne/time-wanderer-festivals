import { Card } from '@/components/ui/card';
import { useEffect } from 'react';

interface AdContainerProps {
  type: 'horizontal' | 'rectangle';
  className?: string;
}

export const AdContainer = ({ type, className = '' }: AdContainerProps) => {
  // Determine dimensions class for Card (kept for styling wrapper)
  const dimensions = type === 'horizontal' 
    ? 'h-20 w-full' 
    : 'h-48 w-64';

  // Define inline style for ad <ins> element based on type
  const adStyle = type === 'horizontal'
    ? { display: 'block', width: '728px', height: '90px' }
    : { display: 'block', width: '300px', height: '250px' };

  // Load AdSense script on mount if not already loaded
  useEffect(() => {
    const scriptId = 'adsbygoogle-js';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4447953515841215';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }
    // Initialize adsbygoogle using type assertion to fix TypeScript error
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error('Adsense error:', e);
    }
  }, []);

  return (
    <Card className={`ad-container ${dimensions} ${className} border-dashed border-2 border-muted flex items-center justify-center bg-muted/10`}>
      {/* Render AdSense ad unit */}
      <ins className="adsbygoogle"
           style={adStyle}
           data-ad-client="ca-pub-4447953515841215"
           data-ad-slot="1234567890"  // Replace with your actual ad slot id
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </Card>
  );
};