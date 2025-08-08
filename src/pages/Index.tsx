import { WorldClock } from '@/components/WorldClock';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
      <div className="container mx-auto px-4 py-8">
        <WorldClock />
      </div>
    </div>
  );
};

export default Index;
