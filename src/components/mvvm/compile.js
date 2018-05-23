import CompileUtil from './compileUtil'
/**
 * 编译模版
 */
class Compile {

    constructor(el, vm) {
        // 处理el传值问题，是dom元素还是id
        this.el = this.isElmentNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        if (this.el) {
            // 1. 把真实的dom元素移入内存中（性能优化）
            let fragment = this.nodeTofragment(this.el);
            // 2. 编译开始 => 提取v-model和文本节点{{}}
            this.compile(fragment);
            this.el.appendChild(fragment);
        }
    }

    // 核心方法
    // 把真实的dom元素移入内存中
    nodeTofragment(el) {
        // 实现方式1
        // let _fragment = document.createDocumentFragment(),
        //     divTemp = document.createElement('div'),
        //     nodes = null;
        // divTemp.innerHTML = el.innerHTML;
        // nodes = divTemp.childNodes;
        // for (var i = 0; i < nodes.length; i++) {
        //     _fragment.appendChild(nodes[i].cloneNode(true));
        // }
        // return _fragment;

        // 实现方式2：文档碎片 内存中的dom节点
        let fragment = document.createDocumentFragment();
        let firstChild;
        while (firstChild = el.firstChild) {
            fragment.appendChild(firstChild);
            // appendChild具有移动性
        }
        return fragment; // 内存中的节点
    }

    // 编译
    compile(fragment) {
        // 递归，每次取子元素
        let _childNodes = fragment.childNodes;
        Array.from(_childNodes).forEach((node) => {
            if(this.isElmentNode(node)) {
                // 编译元素节点，此情况需要继续递归
                this.compileElement(node);
                this.compile(node);
            } else {
                // 编译文本节点
                this.compileText(node);
            }
        })
    }

    // 编译元素节点(*** v-model="message.a")
    compileElement(node) {
        let _attrs = node.attributes; // 取得当前元素节点上的所有属性
        Array.from(_attrs).forEach(attr => {
            // 判断属性名字是不是包含v-xx指令
            let _attrName = attr.name; // *** v-model
            if(this.isDirective(_attrName)) {
                let expr = attr.value; // *** message.a
                // let type = _attrName.split('-')[1]; es6实现方式如下：
                let [, type] = _attrName.split('-'); // *** model
                // 调用对应的编译方法 *** CompileUtil['model'](childNode, this.vm, message.a);
                CompileUtil[type](node, this.vm, expr);
            }
        })
    }

    // 编译文本节点({{MVVM}})
    compileText(node) {
        let expr = node.textContent; // 获取文本内容 *** {{MVVM}}
        let reg = /\{\{([^\}]+)\}\}/g; // 匹配{{xxx}}
        if(reg.test(expr)) {
            CompileUtil['text'](node, this.vm, expr); // CompileUtil['text'](childNode, this.vm, {{MVVM}})
        }
    }

    // 辅助方法：判断是否是指令（v-xxx）
    isDirective(arrName) {
        return arrName.includes('v-');
    }

    // 辅助方法：判断是否是dom对象
    isElmentNode(el) {
        return el.nodeType === 1;
    }

}
export default Compile;