import Dep from './dep'
export default class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        // 获取旧值
        this.value = this.getOldVal();
    }
    getOldVal() {
        Dep.target = this;
        let val = this.getVal(this.vm, this.expr);
        Dep.target = null;
        return val;
    }
    getVal(vm, expr) {
        expr = expr.split('.');
        return expr.reduce((prev, next) => {
            return prev[next];
        }, vm.$data);
    }
    update() {
        let newVal = this.getVal(this.vm, this.expr);
        let oldVal = this.value;
        if(newVal != oldVal) {
            this.cb(newVal);
        }
    }
}