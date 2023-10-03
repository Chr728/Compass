import {Logger} from '../middlewares/logger';
import {UserAttributes} from '../models/user';

const userValidator = (values : UserAttributes) => {
    // const {email, firstName, lastName, streetAddress, city, province,postalCode, phoneNumber} = values;
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
    //check if street is valid
    // if(!streetAddress || typeof streetAddress!== 'string') {
    //     Logger.error(`Invalid street: ${streetAddress}`);
    //     throw new Error(`Invalid street: ${streetAddress}`);
    // }
    // //check if city is valid
    // if(!city || typeof city !== 'string') {
    //     Logger.error(`Invalid city: ${city}`);
    //    throw new Error(`Invalid city: ${city}`);
    // }
    // //check if province is valid
    // if(!province || typeof province !== 'string') {
    //     Logger.error(`Invalid province: ${province}`);
    //     throw new Error(`Invalid province: ${province}`);
    // }
    // //check if postal code is valid
    // if (!postalCode || typeof postalCode !== 'string' || !/[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9]$/i.test(postalCode)){
    //     Logger.error(`Invalid postal code: ${postalCode}`);
    //     throw new Error(`Invalid postal code: ${postalCode}`);
    // }
    //check if phone number is valid
    if(!phoneNumber || typeof phoneNumber !== 'string' || !/^[0-9]{10}$/.test(phoneNumber)) {
        Logger.error(`Invalid phone number: ${phoneNumber}`);
        throw new Error(`Invalid phone number: ${phoneNumber}`);
    }
}

export {
   userValidator
}