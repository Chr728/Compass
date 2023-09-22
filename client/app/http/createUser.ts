
export const createUser = async (body:any
) => {
    console.log(body)
    await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then((response) => {
        console.log('response',response)
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Something went wrong');
        }
    })}

export default createUser;