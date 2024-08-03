const express=require('express')
const heavyWork=require('./heavywork')
const client = require('prom-client');
const responseTime = require('response-time');
const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");

const options = {
    transports: [
      new LokiTransport({
        host: "http://127.0.0.1:3100"
      })
    ]
  };
 const logger = createLogger(options);

const app=express()
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register:client.register });

const reqResTime=new client.Histogram({
    name:'http_sahil_learn',
    help:'Duration of HTTP requests in seconds',
    labelNames:['method','status','route'],
    buckets:[1,50,100,500,1000] 
})

const counter=new client.Counter({
    name:'sahil_counter',
    help:'counter for sahil'
})

app.use(responseTime(function (req, res, time) {
    counter.inc();
    reqResTime
        .labels(
            {
                method: req.method,
                status: res.statusCode,
                route: req.url
            }
        ).observe(time);
  }));

app.get('/',(req,res)=>{
    logger.info("Request for /")
    res.send("Learning logging and metrics using prometheus,graffana And loki")
})

app.get('/slow',heavyWork)


//Start a new route for prometheus metrics
app.get('/metrics',async(req,res)=>{
    res.setHeader('Content-Type',client.register.contentType)
    const metrics=await client.register.metrics()
    res.send(metrics)
})


app.listen(8000,()=>{
    console.log(`server started at port 8000`)
})