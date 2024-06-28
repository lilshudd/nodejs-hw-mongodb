const mongoose = require('mongoose');

const initMongoConnection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://maxfedorak10:exJCEK69khIkipW9@cluster0.3yeofnv.mongodb.net/contacts?retryWrites=true&w=majority`,
      {
        serverSelectionTimeoutMS: 3000,
      },
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = { initMongoConnection };
