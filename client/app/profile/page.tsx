// docker-compose -f docker-compose-dev.yml up
import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { getUser } from '../http/getUser'; // Import your getUser logic

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    values: {
      email: "",
      firstName: "",
      lastName: "",
      streetAddress: "",
      city: "",
      province: "",
      postalCode: "",
      phoneNumber: "",
      birthDate: "",
      sex: "",
    },
  });

  useEffect(() => {
    if (user && user.uid) {
      // Call your getUser function to fetch user data
      getUser(user.uid)
        .then((userData) => {
          // Update the profile state with the fetched user data
          setProfile({
            values: {
              email: user.email || "",
              firstName:profile.values.firstName || "",
              lastName: profile.values.lastName || "",
              streetAddress: profile.values.streetAddress || "",
              city: profile.values.city|| "",
              province: profile.values.province || "",
              postalCode: profile.values.postalCode || "",
              phoneNumber: profile.values.phoneNumber || "",
              birthDate: profile.values.birthDate || "",
              sex: profile.values.sex || "",
            },
          });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [user]);

  return (
    <div className="bg-eggshell min-h-screen flex flex-col justify-center">
      <p className="text-md ml-2 text-darkgrey" style={{ display: 'inline' }}>
        First Name: {profile.values.firstName}
      </p>

    </div>
  );
}

// const Profile = () => {
//   const { user } = useContext(AuthContext);
 
//   return (
//      console.log(getUser('EKDqwnL967h8eiEiP43yhpZ4hJp1')),

//     <div className= "text-darkgrey">
//       {/* <h1>Welcome, {USER?.firstName}!</h1> */}
//       <p>Email: {user?.email}</p>
//       <p>Phone: {user?.phoneNumber}</p>
//       <p>UID: {user?.uid}</p>
//     </div>
   
//   );
// };
// export default Profile;


// export default function Profile() {
//   const router = useRouter();
//   const { user } = useAuth();


// const [profile, setProfile] = useState({
//   values: {
//     uid: "",
//     email: "",
//     firstName: "",
//     lastName: "",
//     streetAddress: "",
//     city: "",
//     province: "",
//     postalCode: "",
//     phoneNumber: "",
//     birthDate: "",
//     sex: "",
//   },
// });


// const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (user && user.uid) {
//       getUser(user.uid)
//         .then((userData) => {
//           if (user) {
//            setProfile({getUser(uid)}));
//             setProfile({
//               values: {
//                 uid: user.uid || "",
//                 email: user.email || "",
//                 firstName: user?.fname || "",
//                 lastName: userData.lastName || "",
//                 streetAddress: userData.streetAddress || "",
//                 city: userData.city || "",
//                 province: userData.province || "",
//                 postalCode: userData.postalCode || "",
//                 phoneNumber: userData.phoneNumber || "",
//                 birthDate: userData.birthDate || "",
//                 sex: userData.sex || "",
//               },
//             });
//           } else {
//             setError(null);
//           }
//           setIsLoading(false);
//         })
//         .catch((error) => {
//           setError(null);
//           setIsLoading(false);
//         });
//     }
//   }, [user]);

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }








    
//   return (
//     <div className="bg-eggshell min-h-screen flex flex-col justify-center">
//         <button onClick={() => router.back()}>
//         <Header headerText="View Profile"></Header>
//       </button>
//       <span className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
//       <div className="mt-3 relative"> 
//     <div>
//         <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>First Name : </p>
//         <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}> {user?.email}</p>
//         <br></br>
//         <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>Last Name : </p>
//         <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>Fred</p>
//         <br></br>
//         <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>Email : </p>
//         <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>M1234@gmail.com</p>
//         <br></br>
//         <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>Street Address : </p>
//         <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>1212 Alexis Nihon</p>
//         <br></br>
//         <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>City: </p>
//         <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>Saint Laurent</p>
//         <br></br>
//         <p className="text-lg ml-0 font-sans text-darkgrey font-bold text-[16px]" style={{ display: 'inline' }}>Province: </p>
//         <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>QC</p>
//         <br></br>
//         <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>Postal Code : </p>
//         <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>M8J 2J3</p>
//         <br></br>
//         <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>Phone number : </p>
//         <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>5144424829</p>
//         <br></br>
//         <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>Birth Date : </p>
//         <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>04-31-1999</p>
//         <br></br>
//         <p className="text-lg ml-0 font-sans text-darkgrey  font-bold text-[16px]" style={{ display: 'inline' }}>Sex : </p>
//         <p className="text-md ml-2 text-darkgrey"  style={{ display: 'inline' }}>Male</p>
//         <br></br>
//    </div>
            
//     </div>

//     <div className="flex justify-center mt-6">
//     <Link href="/editprofile"  className="mt-6">
//             <Button type="submit" text="Edit Profile" style={{ width: '180px', alignContent:'center' }} />
//             </Link> 
//         </div>    
//     </span>
//     <div className="mt-4" >
//     <div className={`xl:max-w-[1280px] w-full  menu-container`}>
//       <Menu />
//     </div>
//     </div>

//     </div>
//   );
// }
