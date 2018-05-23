import Compile from './compile'
import Observe from './observe'
class MVVM {
    constructor(opts) {
        this.$el = opts.el;
        this.$data = opts.data;
        if(this.$el) {
            new Observe(this.$data);
            
            console.log(this.$data);
            new Compile(this.$el, this);
        }
    }
}
export default MVVM;