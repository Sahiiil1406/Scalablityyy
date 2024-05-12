const express=require('express');
const redis=require('ioredis');

const app=express();

//midddleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const redisClient=new redis();
redisClient.on('connect',()=>{
    console.log('Connected to Redis');
});
redisClient.on('error',()=>{
    console.log('Error in  Redis',error);
});

const count=1;
//console.log(redisClient)
const addQueue=async(req,res)=>{
    try {
        const {name}=req.params;
        console.log(name)
        const name1=JSON.stringify(name);
        redisClient.lpush('queue',name1);
        console.log("added to queue",count,name)
        return res.json({
            message:'Added to queue'
        });
    } catch (error) {
        return res.status(500).json({
            message:'Error in adding to queue',
            error
        });
    }
}

app.post("/:name",addQueue);
app.get("/",(req,res)=>{
    return res.json({
        message:'Welcome to Redis'
    });
});


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});