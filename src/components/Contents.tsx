import { Route, Router } from "@solidjs/router";

// Pages
import HomePage from "../pages/Home.tsx";
import CardMenu from "../pages/CardMenu.tsx";
import EditNote from "../pages/EditNote.tsx";
import NewNote from "../pages/NewNote.tsx";
import Note from "../pages/Note.tsx";
import SettingsMenu from "../pages/Settings.tsx";


export default function Contents() {

    return (
        <div id='Content' class='h-full w-full overflow-y-scroll scroll-smooth'>
            {/* <div class='min-w-100 w-3/4 place-self-center-safe flex flex-col'> */}
                <Router>
                    <Route path='/' component={HomePage} />
                    {/* <Route path='/category/new' component={CardMenu} /> */}
                    <Route path='/new/*path' component={NewNote} />
                    <Route path='/show/*path' component={CardMenu} />
                    <Route path='/note/:id' component={Note} />
                    <Route path='/note/:id/edit' component={EditNote} />
                    <Route path='/settings' component={SettingsMenu} />
                </Router>
            {/* </div> */}
        </div>
    );
}