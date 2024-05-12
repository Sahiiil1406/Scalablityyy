const {Worker} = require('bullmq');
const redis = require('ioredis');


//connect worker with redis
const redisOptions = {
    // Other Redis options...
    maxRetriesPerRequest: null,
  };
  
  // Now you can pass `redisOptions` when creating the Redis client
  
const connection = new redis(redisOptions);
connection.on('connect',()=>{
    console.log('Connected to redis');
});


const worker = new Worker('Sahil-queue', async(job)=>{
    setTimeout(()=>{
        console.log('Job completed',job.id);
        console.log('Job data',job.name);
    },5000); //console.log('Job data',job.data);
},{connection});