import 'solid-js'
// import { createSignal } from 'solid-js'
// import solidLogo from './assets/solid.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import Sidebar from './components/sidebar';
import Contents from './components/content';

function App() {
  // const [count, setCount] = createSignal(0)

  return (
    <div class='h-dvh max-h-dvh w-dvw max-w-dvw flex dark:bg-zinc-800 dark:text-white' >
      <Sidebar />
      <div id='Content' class='h-full w-full overflow-y-auto scroll-smooth'>
        <div class='min-w-100 w-3/4 place-self-center-safe flex flex-col'>
          <Contents />
        </div>
      </div>
    </div>
  )
}

export default App
