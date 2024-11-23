const express=require('express');
const app=express();

let count=0;
const PORT=3002;
app.get('/',(req,res)=>{
    console.log(`Server2: ${count++}`);
    res.send('Server2');
});

app.listen(PORT,()=>{
    console.log('Server1 is running on 3002');
});