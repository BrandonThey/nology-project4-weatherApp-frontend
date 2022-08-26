import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
function App() {

  const handleSubmit = (event) => {
    event.preventDefault();
    const searchTerm = event.target[0].value;
    console.log(searchTerm);
  }

  return (
    <div className="App">
      <SearchBar handleSubmit={handleSubmit}/>
    </div>
  );
}

export default App;
