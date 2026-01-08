const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
require('dotenv').config();

const PROTO_PATH = path.join(__dirname, '../proto/library.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const libraryProto = grpc.loadPackageDefinition(packageDefinition).library;

const grpcClient = new libraryProto.LibraryService(
    process.env.GRPC_SERVER_ADDRESS,
    grpc.credentials.createInsecure()
);

console.log('src/grpc/grpcClient.js: grpc client initialized');
module.exports = grpcClient;
