const mystack=[];
mystack.push(1);
mystack.push(2);
mystack.push(3);
console.log(mystack.pop());

const myqueue=[];
myqueue.push(2);
myqueue.push(3);
myqueue.push(4);
console.log(myqueue.shift())
console.log(myqueue.shift())

myqueue.unshift(6);


//slicing

const arr=[1,2,6,9,10,11,100,105]

console.log(arr.splice(3,5));
