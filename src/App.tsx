import 'solid-js'
// import { createSignal } from 'solid-js'
// import solidLogo from './assets/solid.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import Sidebar from './components/Sidebar.tsx';
import Content from './components/Contents.tsx';
import { loadTheme } from "./themes.tsx";

function App() {
  // const [count, setCount] = createSignal(0)
  loadTheme()

  return (
    <div class='h-dvh max-h-dvh w-dvw max-w-dvw flex' >
      <Sidebar />
      <Content />
    </div>
  )
}

export default App
