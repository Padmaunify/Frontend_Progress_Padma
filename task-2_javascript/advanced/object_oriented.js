function person(name,age){
    this.name= name;
    this.age= age;
    this.describe= function(){
        return this.name + "," + age + " years old";
    } 
}

const p1=new person("John",19);
console.log(p1.describe());