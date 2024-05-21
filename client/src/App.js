import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Fib from "./Fib";
import OtherPage from "./OtherPage";

function App() {
  return (
    <BrowserRouter>
      <div>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          Welcome to React App
        </div>
        <Link to="/">Home</Link>
        <Link to="/otherpage">Other Page</Link>
        <Routes>
          <Route exact path="/" element={<Fib />} />
          <Route path="/otherpage" element={<OtherPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
