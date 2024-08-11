// import path from 'path';
// import * as grpc from '@grpc/grpc-js';
// import  {  ServiceClientConstructor } from "@grpc/grpc-js"
// import * as protoLoader from '@grpc/proto-loader';
const path= require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { request } = require('http');
const packageDefinition = protoLoader.loadSync(path.join(__dirname, './todo.proto'));

const personProto = grpc.loadPackageDefinition(packageDefinition);
let toDo=[]
const createTodo=(call,callback)=>{
    const Todo={
        name:call.request.name,
        description:call.request.description,
        id:toDo.length+1
    }
    toDo.push(Todo)
    console.log(toDo)
    callback(null,Todo)
}
const getTodo=(call,callback)=>{
    const id=call.request.id
    console.log(toDo)
    callback(null,toDo[id-1])
}
const updateTodo=(call,callback)=>{
    const id=call.request.id;
    toDo[id-1].name=call.request.name || toDo[id-1].name;
    toDo[id-1].description=call.request.description || toDo[id-1].description;
    console.log(toDo)
    callback(null,toDo[id-1])
}
const deleteTodo=(call,callback)=>{
    const id=call.request.id;
    const x=toDo.filter((e)=>{
        if(e.id != id){
            return e
        }
    })
    console.log(x)
    toDo=x;
    callback(null,toDo[id-1])
}
const getAllTodo=(call,callback)=>{
    callback(null,{todos:toDo})
}


const server = new grpc.Server();
server.addService(personProto.CrudTodo.service, {
    AddTodo: createTodo,
    GetTodo:getTodo,
    UpdateTodo:updateTodo,
    DeleteTodo:deleteTodo,
    GetAllTodos:getAllTodo

});
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});