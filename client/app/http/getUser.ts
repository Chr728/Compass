export const getUser = async (id: string) => {
    const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Something went wrong');
    }

    const userData = await response.json();
    return userData;
};


export default getUser;