import { AppProvider } from '@/context/AppProvider';
import { StyleSwipeApp } from '@/components/StyleSwipeApp';

export default function Home() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <AppProvider>
          <StyleSwipeApp />
        </AppProvider>
      </div>
    </div>
  );
}
