const apibyId=async (id)=>{
    //wait for 2s
    await new Promise((resolve,reject)=>{
        //console.log('Resolved');
        setTimeout(()=>{
            resolve();
        },2000);
    });
    //console.log('Returning-2s');
    return `Sahil-${id}`;
}

const api=async ()=>{
    //wait for 2s
    await new Promise((resolve,reject)=>{
        //console.log('Resolved');
        setTimeout(()=>{
            resolve();
        },2000);
    });
    //console.log('Returning-2s');
    return `Sahil-onlu api calledwithout id`;
}


module.exports={
    api,
    apibyId
};