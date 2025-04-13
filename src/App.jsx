import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import ShowRoutes from './Components/Routes/Showroutes'
import { AuthProvider } from './Components/Context/AuthProvider'
function App() {

  return (
    <>
    <Router>
      <AuthProvider>
     <ShowRoutes/>
      </AuthProvider>
    </Router>
    </>
  )
}

export default App
