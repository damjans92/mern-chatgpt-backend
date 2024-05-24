import { connect, disconnect } from 'mongoose';
async function connectToDB() {
    try {
        await connect(process.env.MONGODB_URL);
    }
    catch (error) {
        console.log(error);
        throw new Error('Cannot connect to MongoDB');
    }
}
async function disconnectFromDB() {
    try {
        await disconnect();
    }
    catch (error) {
        console.log(error);
        throw new Error('Could not disconnect from MongoDB');
    }
}
export { connectToDB, disconnectFromDB };
//# sourceMappingURL=connection.js.map