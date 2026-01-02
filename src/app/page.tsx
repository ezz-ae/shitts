import { AppProvider } from '@/context/AppProvider';
import { StyleSwipeApp } from '@/components/StyleSwipeApp';

export default function Home() {
  return (
    <AppProvider>
      <StyleSwipeApp />
    </AppProvider>
  );
}
