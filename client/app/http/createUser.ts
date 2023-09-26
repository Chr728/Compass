import {createUserAttributes} from '@/app/lib/Models/User';

export const createUser = async (body:createUserAttributes
) => {
    await fetch("http://localhost:8000/api/users", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error creating user');
        }
    })}

export default createUser;