import {Logger} from '../middlewares/logger';
import {UserAttributes} from '../models/user';
import {SpeedDialAttributes} from '../models/speedDial';

const userValidator = (values : UserAttributes) => {
    const {email, firstName, lastName, phoneNumber} = values;
    //check if email is valid
    if(!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        Logger.error(`Invalid email: ${email}`);
        throw new Error(`Invalid email: ${email}`);
    }
    //check if first name is valid
    if(!firstName || /\d/.test(firstName) || typeof firstName !== 'string') {
        Logger.error(`Invalid first name: ${firstName}`);
        throw new Error(`Invalid first name: ${firstName}`);
    }
    //check if last name is valid
    if(!lastName || /\d/.test(lastName) || typeof lastName !== 'string') {
        Logger.error(`Invalid last name: ${lastName}`);
        throw new Error(`Invalid last name: ${lastName}`);
    }
    //check if phone number is valid
    if(!phoneNumber || typeof phoneNumber !== 'string' || !/^[0-9]{10}$/.test(phoneNumber)) {
        Logger.error(`Invalid phone number: ${phoneNumber}`);
        throw new Error(`Invalid phone number: ${phoneNumber}`);
    }
}

const speedDialValidator = (values : SpeedDialAttributes) => {
    const {contactName, contactNumber} = values;
    //check if contact name is valid
    if(!contactName || /\d/.test(contactName) || typeof contactName !== 'string') {
        Logger.error(`Invalid contact name: ${contactName}`);
        throw new Error(`Invalid contact name: ${contactName}`);
    }
    //check if contact number is valid
    if(!contactNumber || typeof contactNumber !== 'string' || !/^[0-9]{10}$/.test(contactNumber)) {
        Logger.error(`Invalid contact number: ${contactNumber}`);
        throw new Error(`Invalid contact number: ${contactNumber}`);
    }

}

export {
   userValidator
}