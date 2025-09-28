import 'solid-js'
// import { createSignal } from 'solid-js'
// import solidLogo from './assets/solid.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import Sidebar from './components/sidebar';
import { CardList } from './components/content';

function App() {
  // const [count, setCount] = createSignal(0)

  return (
    <div style="height: 100dvh; width: 100dvw" class='flex dark:bg-zinc-800 dark:text-white' >
      <Sidebar />
      <CardList />
    </div>
  )
}

export default App
