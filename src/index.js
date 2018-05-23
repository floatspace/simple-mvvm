import MVVM from './components/mvvm/mvvm';
window.vm = null;
window.onload = function(){
    vm = new MVVM({
        el: '#app',
        data: {
            message: {a: 'MVVM'},
            b: 'test'
        }
    });
}