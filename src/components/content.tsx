import { Route, Router } from "@solidjs/router";

// Pages
import StartPage from "../pages/Start.tsx";
import CardMenu from "../pages/CardMenu.tsx";


export default function Contents() {

    return (
        <div class='min-w-100 w-3/4 place-self-center-safe flex flex-col'>
            <Router>
                <Route path='/' component={StartPage} />
                <Route path='/c' component={CardMenu} />
                <Route path='/c/:name' component={CardMenu} />
            </Router>
        </div>
    );
}