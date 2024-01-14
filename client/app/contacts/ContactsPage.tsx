'use client';
// import FormDialog from '../components/FormDialog'
import Button from '../components/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { useAuth } from '@/app/contexts/AuthContext';
import { deleteSpeedDial, getSpeedDial, getSpeedDials, createSpeedDial } from '../http/speedDialAPI';
import Custom403 from '../pages/403';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { useProp } from "../contexts/PropContext";
import Grid from '@mui/material/Grid';
import Swal from 'sweetalert2';


export default function Contacts() {
  const logger = require('../../logger');
  const { user } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]); // [ { name: 'John Doe', phone: '123-456-7890' }
  const router = useRouter();
  const { handlePopUp } = useProp();
  let supported = false;

  useEffect(() => {
    if (!user){
      router.push("/login")
    }
  }, [user]);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const userId = user?.uid || '';
        const result = await getSpeedDials();    
        logger.info('All speed dial entries retrieved:', result);
        setContacts(result.data);
      } catch (error) {
        logger.error('Error retrieving speed dial entries:', error);
      }
    }
      fetchContacts();
  }, [user]);

  // check if the contact picker API is supported
  // need to add fallback in case contact picker API is not supported
  try {
    supported = ('contacts' in navigator && 'ContactsManager' in window);
  }
  catch (error) {
    logger.error('Contact picker API unsupported. ', error);
    supported = false;
  }

  const selectContact = async () => {
    if (!supported) {
      router.push('/createContacts');
    }
    else {
      const contact = await navigator.contacts.select(['name', 'tel'], {
        multiple: false,
      });
      // Remove any non-digit characters from the phone number
      const phoneNumber = contact[0].tel[0].replace(/\D/g, '');
      const contactInfo = {
        contactName: contact[0].name[0],
        contactNumber: phoneNumber,
      };
      if (phoneNumber.length == 10) {
        console.log(contactInfo);
        createSpeedDial(contactInfo);
      } else{
        // Reject the contact if the phone number is not 10 digits and throw an error
        handlePopUp("error", "Phone number must be 10 digits.");
        throw new Error('Phone number must be 10 digits');
      }
      return contactInfo;
    }
  }

  async function deleteContact(contactId: string){
    Swal.fire({
      text: "Are you sure you want to delete this contact?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        const deleteresult = await deleteSpeedDial(contactId);   
        const newData = contacts && contacts.filter((item: { id: string; }) => item.id!=contactId);
        setContacts(newData);
        router.push('/contacts'); 
        Swal.fire({
          title: "Deleted!",
          text: "Your contact has been deleted.",
          icon: "success"
        });    
      }
  }); 
  }

  // formats a phone number to (xxx) xxx-xxxx
  function formatPhoneNumber(phoneNumberString: string) {
    const match = phoneNumberString.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  }

  if (!user) {
    return <div><Custom403/></div>
  }
  
  return (
    <div className="bg-eggshell p-2 min-h-screen flex flex-col">
        <div className="mb-10 flex flex-col w-full p-4">
        <div style={{ marginTop: '-5%' }} >
        <button className="mt-3 mb-4" onClick={() => router.push('/tpage')}>
          <Header  headerText="Your Contacts"></Header>
        </button>
        
      <p className="text-darkgrey mb-4">Contact your loved ones with the click of a button.</p>   
      
      {/* <FormDialog
        label="Add a Contact"
        title="Add a Contact"
        description="Please fill out the form."
        onSubmit={handleFormSubmit}
      /> */}

      <div style={{padding: '8px 8px 0 16px'}}>
          <Button 
          type="button" 
          text="Add a contact" 
          onClick={ () => selectContact() } 
          style={{ 
              width: '100px', 
              height: '34px', 
              padding: '2px', 
              borderRadius: '3px', 
              fontSize: '14px'
          }}/>
      </div>

      <div className="mt-4">
        <Grid container spacing = {2}>
          {contacts && contacts.map((data: any, index: number) => (
            <Grid item xs={6} key={index}>
              <div onClick={() => window.location.href = `tel:${data.contactNumber}`}>
                <Card>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {formatPhoneNumber(data.contactNumber)}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {data.contactName.length > 8 ? `${data.contactName.substring(0, 8)}...` : data.contactName}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <MdModeEdit 
                      style={{ width: '25px', height: '30px', float: 'left' }}
                      onClick={(event) => {
                        event.stopPropagation();
                        router.push(`/contacts/${data.id}`);
                      }}
                    />
                    <MdDeleteForever
                      style={{ color: 'var(--Red, #FF7171)', width: '25px', height: '30px', float: 'right' }}
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteContact(data.id);
                      }}
                    />
                  </CardActions>
                </Card>
              </div>
            </Grid>
          ))} 
        </Grid>
      </div>

    </div>
  </div>
</div>
);
}