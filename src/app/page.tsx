import { AppProvider } from '@/context/AppProvider';
import { StyleSwipeApp } from '@/components/StyleSwipeApp';

export default function Home() {
  return (
    <main className="flex justify-center items-center h-full">
      <div className="w-full h-full max-w-md mx-auto">
        <AppProvider>
          <StyleSwipeApp />
        </AppProvider>
      </div>
    </main>
  );
}
