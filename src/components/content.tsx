import { Route, Router } from "@solidjs/router";

// Pages
import StartPage from "../pages/Start.tsx";
import CardMenu from "../pages/CardMenu.tsx";
import NewNote from "../pages/NewNote.tsx";
import Note from "../pages/Note.tsx";


export default function Contents() {

    return (
        <div class='min-w-100 w-3/4 place-self-center-safe flex flex-col'>
            <Router>
                <Route path='/' component={StartPage} />
                <Route path='/c/new' component={CardMenu} />
                <Route path='/n/create' component={NewNote} />
                <Route path='/c/:name/*' component={CardMenu} />
                <Route path='/n/:id' component={Note} />
                <Route path='/n/:id/edit' component={Note} />
            </Router>
        </div>
    );
}