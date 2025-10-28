import Board from './components/Board';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800">Ticketing System</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Board />
      </main>
    </div>
  );
}

export default App;
