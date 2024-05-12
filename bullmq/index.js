const express=require('express');
const redis=require('ioredis');
const {Queue,Worker}=require('bullmq');

const app=express();

//connect redis
const connection=new redis();
connection.on('connect',()=>{
    console.log('Connected to redis');
});
//midddleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const queue=new Queue('Sahil-queue',connection);

const addJobs=async(req,res)=>{
    try {
        const {name}=req.params;
        const job=await queue.add('worker',{name});
        console.log('Job added',job.id);
        return res.json({
            message:'Job added to queue',
            job
        });
    } catch (error) {
        return res.status(500).json({
            message:'Error in adding job to queue',
            error
        });
    }
}
app.post("/:name",addJobs);
app.get("/",(req,res)=>{
    return res.json({
        message:'Welcome to Bullmq'
    });
});
app.listen(3001,()=>{
    console.log('Server is running on port 3000');
});