
const redis=require('ioredis');

const redisClient=new redis();

redisClient.on('error',()=>{
    console.log('Error in  Redis');
});

const workerQueue=async(req,res)=>{
    try {
        redisClient.on('connect',()=>{
            console.log('Connected to Redis');
        });
        while(true){
            const data=await redisClient.brpop('queue',0);
           // const name=JSON.parse(data);
           setTimeout(()=>{
            console.log('Processing',data);
           },5000);
            
        }
     
    } catch (error) {
        console.log('Error in processing',error);
     
    }
}

workerQueue();