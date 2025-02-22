import Dashboard from "./views/Dashboard.js";
import Posts from "./views/Posts.js";
import Settings from "./views/Settings.js";
import PostsView from "./views/PostsView.js";

const pathToRegex = path =>  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = (url) => {
	history.pushState(null, null, url);
	router();
};

const router = async () => {
	const routes = [
		{ path: "/", view: Dashboard },
		{ path: "/posts", view: Posts },
        { path: "/posts/:id", view: PostsView },
		{ path: "/settings", view: Settings },
	];

	const potentialMatch = routes.map((r) => {
		return {
			route: r,
			result: location.pathname.match(pathToRegex(r.path)),
		};
	});

	let match = potentialMatch.find((pm) => pm.result !== null);

	if (!match) {
		match = {
			route: routes[0],
			result: [location.pathname],
		};
	}

    const view = new match.route.view(getParams(match));

    document.querySelector("#app").innerHTML = await view.getHtml();

};

window.addEventListener("popstate",router);

document.addEventListener("DOMContentLoaded", () => {
	router();
	document.body.addEventListener("click", (e) => {
		if (e.target.matches("[data-link]")) {
			e.preventDefault();
			navigateTo(e.target.href);
		}
	});
});
