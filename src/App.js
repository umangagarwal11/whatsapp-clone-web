import classes from './App.module.css';
import Home from './containers/Home/Home';

function App() {
  return (
    <div className={classes.App}>
      <div className={classes.Green}></div>
      <Home />
    </div>
  );
}

export default App;
