require('dotenv').config({
    path: '../../.env'
})

// const fetchLocations = async (latitude: number, longitude: number, type: string) => {
//     const radius = 10000;
//     const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
//     const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`
//
//     try {
//         let places: google.maps.places.PlaceResult[] = []
//         const res = await fetch(url);
//         const data = await res.json()
//         places = places.concat(data.results)
//             .filter(place =>
//                 place.business_status === "OPERATIONAL")
//         return places.slice(0, 10)
//     } catch (err: any) {
//         console.log("Error fetching locations: ", err)
//     }
// }


const fetchLocations = async (latitude: number, longitude: number, type: string) => {

}

export default fetchLocations;
