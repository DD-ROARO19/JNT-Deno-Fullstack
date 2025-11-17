/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')
// console.log(root);
if (!(root instanceof HTMLElement)) {
    throw new Error("Root element 404!");
}

render(() => <App />, root)
