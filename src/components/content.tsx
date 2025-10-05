import { Route, Router } from "@solidjs/router";

// Pages
import StartPage from "../pages/Start";
import CardMenu from "../pages/CardMenu";


const root = () => (
    <StartPage />
)

export default function Contents() {

    return (
        <Router root={root} >
            <Route path='/c' component={CardMenu} />
            <Route path='/c/:name' component={CardMenu} />
        </Router>
    );
}