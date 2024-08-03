
const heavyWork=async(req,res)=>{
    
   const t=Math.random()*10000
  //wait for 2 seconds
    await new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve()
        },t)
    })

   return res.send("Work Done")
}

module.exports=heavyWork