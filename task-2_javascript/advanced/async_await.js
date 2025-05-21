function sleep(ms){
    return new Promise((resolve)=>setTimeout(resolve,ms));
}

async function strUppercase(mystr){
    await sleep(500);
    return mystr.toUpperCase();
}

strUppercase("helloworld").then((result)=>{
    console.log("The result is",result);
}
)