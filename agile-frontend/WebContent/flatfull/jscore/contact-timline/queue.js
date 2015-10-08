var Queue = (function(){

    function Queue() {};

    Queue.prototype.running = false;

    Queue.prototype.queue = [];
    Queue.prototype.running = false;

    Queue.prototype.add_function = function(callback, models) { 
        var _this = this;
        
        //add callback to the queue
        this.queue.push(function(){
            callback(models);
        });
        
        
        if(!this.running)
        {
        	this.next();
        }

        return this; // for chaining fun!
    }
    

    Queue.prototype.next = function() {
       // this.running = false;
        //get the first element off the queue
        var shift = this.queue.shift();
        
        if(shift) {
           this.running = true;
            shift(); 
        }
    }

    Queue.prototype.pop = function() {

       this.queue.pop();
    }

    return Queue;

})();