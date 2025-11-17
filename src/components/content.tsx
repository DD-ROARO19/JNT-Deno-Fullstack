import { Route, Router } from "@solidjs/router";

// Pages
import StartPage from "../pages/Start.tsx";
import CardMenu from "../pages/CardMenu.tsx";
import EditNote from "../pages/EditNote.tsx";
import NewNote from "../pages/NewNote.tsx";
import Note from "../pages/Note.tsx";


export default function Contents() {

    return (
        <div class='min-w-100 w-3/4 place-self-center-safe flex flex-col'>
            <Router>
                <Route path='/' component={StartPage} />
                {/* <Route path='/category/new' component={CardMenu} /> */}
                <Route path='/new/*path' component={NewNote} />
                <Route path='/show/*path' component={CardMenu} />
                <Route path='/note/:id' component={Note} />
                <Route path='/note/:id/edit' component={EditNote} />
            </Router>
        </div>
    );
}