// Test file to check TypeScript compilation
import { useStream } from './hooks/use-stream-store';

const test = () => {
  const store = useStream();
  console.log(store);
};

export default test;