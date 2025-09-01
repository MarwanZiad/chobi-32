// Test file to check TypeScript compilation
import { useStreamStore } from './hooks/use-stream-store';

const test = () => {
  const store = useStreamStore();
  console.log(store);
};

export default test;