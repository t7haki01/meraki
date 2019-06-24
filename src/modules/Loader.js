class Loader{
    constructor(){
        if(!Loader.instance){
            this.ready = false;
            Loader.instance = this;
        }

        return Loader.instance;
    }

    setReady(ready){
        this.ready = ready;
    }

    getReady(){
        return this.ready;
    }
}

const loader = new Loader();

// way of making object read-only
// Object.freeze(loader);

export default loader;