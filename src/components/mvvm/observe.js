import Dep from './dep'
export default class Observe {
    constructor(data) {
        this.observe(data);
    }
    observe(data) {
        if(!data || typeof data !== 'object') {
            return;
        }
        Object.keys(data).forEach((key) => {
            this.defineReactive(data, key,data[key]);
            this.observe(data[key]);
        })
    }
    defineReactive(obj, key, value) {
        let self = this;
        let dep = new Dep();
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set(newValue) {
                if(value != newValue){
                    self.observe(newValue);
                    value = newValue;
                    dep.notify();
                }
            }
        })
    }
}