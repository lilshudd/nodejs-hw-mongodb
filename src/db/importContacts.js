const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Contact } = require('./contact');

require('dotenv').config();

const contactsFilePath = path.join(__dirname, '../../contacts.json');

mongoose.connect(
  `mongodb+srv://maxfedorak10:exJCEK69khIkipW9@cluster0.3yeofnv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

const importContacts = async () => {
  try {
    const contacts = JSON.parse(fs.readFileSync(contactsFilePath, 'utf-8'));
    await Contact.insertMany(contacts);
    console.log('Contacts imported successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error importing contacts:', error);
    mongoose.connection.close();
  }
};

importContacts();
