import Wacher from './watcher'
let CompileUtil = {
    // 文本处理
    text(node, vm, expr) {
        let updateFn = this.updater['text'];
        let value = this.getTextVal(vm, expr);
        expr.replace(/\{\{([^}]+)\}\}/g, (str, arg2) => {
            new Wacher(vm, arg2, (newVal) => {
                updateFn && updateFn(node, this.getTextVal(vm, expr));
            });
        })
        updateFn && updateFn(node, value);
    },
    getTextVal(vm, expr) { // 获取编译文本后的结果
        return expr.replace(/\{\{([^}]+)\}\}/g, (str, arg2) => {
            // 依次去去数据对应的值
            return this.getVal(vm, arg2);
        })
    },
    getVal(vm, expr) { // 获取实例上对应的数据
        expr = expr.split('.'); // {{message.a}} [message,a] 实现依次取值
        // vm.$data.message => vm.$data.message.a
        return expr.reduce((prev, next) => { 
            return prev[next];
        }, vm.$data);
    },
    // 输入框处理
    model(node, vm, expr) {
        let updateFn = this.updater['model'];
        new Wacher(vm, expr, (newVal) => {
            updateFn && updateFn(node, newVal);
        })
        node.addEventListener('input', (e) => {
            let newVal = e.target.value;
            this.setVal(vm, expr, newVal);
        })
        updateFn && updateFn(node, this.getVal(vm, expr));
    },
    setVal(vm, expr, newVal) {
        expr = expr.split('.');
        return expr.reduce((prev, next, curIndex) => {
            if(curIndex === expr.length - 1) {
                return prev[next] = newVal;
            }
            return prev[next]
        }, vm.$data);
    },
    updater: {
        text(node, value) {
            node.textContent = value;
        },
        model(node, value) {
            node.value = value;
        }
    }
};
export default CompileUtil;