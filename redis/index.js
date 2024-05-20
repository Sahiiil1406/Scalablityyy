const express=require('express');
const redis=require('ioredis');
const {api,
    apibyId
}=require('./api.js')

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

//caching of Data by redis
app.get("/cache",async(req,res)=>{
    const check=await redisClient.exists('data');
    if(check){
        const data=await redisClient.get('data');
        return res.json({
            message:'Welcome:Data with redis',
            data:JSON.parse(data)
        });
    }
    const data=await api();
    await redisClient.set('data',JSON.stringify(data));
    return res.json({
        message:'Welcome:Data without redis',
        data
    });

})
app.get("/cache/:id",async(req,res)=>{
    const {id}=req.params;
    //const id=Math.random()
    const check=await redisClient.exists(`cache:${id}`);
    if(check){
        const data=await redisClient.get(`cache:${id}`);
        return res.json({
            message:'Welcome:Data with redis',
            data:JSON.parse(data)
        });
    }
    const data=await apibyId(id)
    await redisClient.set(`cache:${id}`,JSON.stringify(data));
    return res.json({
        message:'Welcome:Data without redis',
        data
    });
});

//middleware to cache data
const checkCache =(key)=>async (req, res, next) => {
    try {
        console.log(key)
        const check=await redisClient.get(key) || false;
        if(check){
            const data=await redisClient.get(key);
            return res.json({
                message:'Welcome:Data with redis',
                data:JSON.parse(data)
            });
        }
        next();
        
    } catch (error) {
        return res.status(500).json({
            message:'Error in caching middleware',
            error
        });
    }
}
//api limliting middleware
const apiLimit=(limit,time)=>async(req,res,next)=>{
    try {
        //const ip=req.ip;
        const ip=req.headers["x-forwarded-for"] || req.socket.remoteAdress ||req.ip;
        console.log(ip)
       
        const check=await redisClient.get(ip)|| 0;
        console.log(check)
        await redisClient.incr(ip);
        
        if(check==1){
            await redisClient.expire(ip,time)
        }
        if(check>=limit){
            return res.status(429).json({
                message:'API limit exceeded'
            });
        }
        
       
        next();
        
    } catch (error) {
        return res.status(500).json({
            message:'Error in api limit middleware',
            error
        });
    }
}


app.get("/checkMiddleware",apiLimit(5,15),checkCache('hell'),async(req,res)=>{
    const data=await api();
    await redisClient.set('hell',JSON.stringify(data));
    return res.json({
        message:'Welcome to Redis,checking api middleware',
        data
    });
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});

//NOTE
//1.Whenever perform any mutation operation on redis, always 
//stringify the data before storing it in redis
//and parse it while fetching the data from redis

//2. Always use try catch block while performing any operation on redis

//3. Always use async await while performing any operation on redis

//4.Data InValidation:whenever perform any mutation on database,invalid the cache(delete the cache)