function helper(mystr){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            if(mystr==null){
                reject("It's a null string");
            }
            else{
                
                resolve(mystr.toUpperCase());
            }
        },1000)
    }
    )
}

helper("hello").then((result)=>{
    console.log("The answer is", result);
}).catch((error)=>{
    console.log(error);
}
)