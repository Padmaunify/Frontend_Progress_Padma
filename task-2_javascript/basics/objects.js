var myobj={
    firstName: "John",
    lastName: "Smith",
    age: 19,
}

myobj["employed"]=true;

for(var member in myobj){
    if(myobj.hasOwnProperty(member)){
        console.log(myobj[member]);
    }
}