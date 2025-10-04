import 'solid-js'
// import { createSignal } from 'solid-js'
// import solidLogo from './assets/solid.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import Sidebar from './components/sidebar';
import { Contents } from './components/content';

function App() {
  // const [count, setCount] = createSignal(0)

  return (
    <div class='h-dvh max-h-dvh w-dvw max-w-dvw flex dark:bg-zinc-800 dark:text-white' >
      <Sidebar />
      <Contents />
    </div>
  )
}

export default App
