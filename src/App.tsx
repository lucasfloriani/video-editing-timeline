import Example from './components/Example'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Example />
    </DndProvider>
  );
};

export default App;
