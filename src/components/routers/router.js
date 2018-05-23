class Router {
    constructor() {
        this.routes = {};
        this.curUrl = '';
        this.history = [];
        this.curIndex = this.history.length - 1;
        this.refresh = this.refresh.bind(this);
        this.backOff = this.backOff.bind(this);
        this.isBack = false;
        window.addEventListener('load', this.refresh, false);
        window.addEventListener('hashchange', this.refresh, false);
    }

    route(path, callback) {
        this.routes[path] = callback || function() {};
    }

    refresh() {
        let curUrl = location.hash.slice(1) || '/';
        if (!this.isBack) {
            if (this.curIndex < this.history.length - 1) {
                this.history = this.history.slice(0, this.curIndex + 1);
            }
            this.history.push(curUrl);
            this.curIndex ++;
        }
        this.routes[curUrl] && this.routes[curUrl]();
        this.isBack = false;
    }

    backOff() {
        this.isBack = true;
        this.curIndex <= 0 ? (this.curIndex = 0) : (this.curIndex -= 1);
        location.hash = `#${this.history[this.curIndex]}`;
        this.routes[this.history[this.curIndex]]();
    }
}

export default Router;