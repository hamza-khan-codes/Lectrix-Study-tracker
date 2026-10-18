import { BrowserRouter } from "react-router-dom"
import AppRoute from "./Routes/AppRoute"
import "@/custom.css"


function App() {


  return (
    <BrowserRouter>
    <AppRoute/>
    </BrowserRouter>


  )
}

export default App
