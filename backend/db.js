const mongoose = require('mongoose');
const mongoURL = 'mongodb+srv://aadityamohit:MpOOv5TV5PdJtSh7@cluster0.eltgmgq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


const connectToMongo = () => {
    mongoose.connect(mongoURL);

    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB successfully');
    });

    mongoose.connection.on('error', (err) => {
        console.error('Error connecting to MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Disconnected from MongoDB');
    });
};

module.exports = connectToMongo;

