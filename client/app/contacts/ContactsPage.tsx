'use client';
import Button from '../components/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { deleteSpeedDial, getSpeedDial, getSpeedDials } from '../http/speedDialAPI';
import Custom403 from '../pages/403';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function Contacts() {
  const logger = require('../../logger');
  const { user } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]); // [ { name: 'John Doe', phone: '123-456-7890' }
  const router = useRouter();

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
    setTimeout(() => {
      fetchContacts();
    }, 1000);
  }, [user]);

  // check if the contact picker API is supported
  // need to add fallback in case contact picker API is not supported
  const supported = ('contacts' in navigator && 'ContactsManager' in window);

  const selectContact = async () => {
    if (!supported) {
      return null;
    }
    const contact = await navigator.contacts.select(['name', 'tel'], {
      multiple: false,
    });
    return `${contact[0].name[0]} - ${contact[0].tel[0]}`;
  }

  async function deleteContact(contactId: string){
    const deleteresult = await deleteSpeedDial(contactId);   
    const newData = contacts && contacts.filter((item: { id: string; }) => item.id!=contactId);
    setContacts(newData);
    router.push('/contacts');
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

      <div style={{padding: '24px 16px 0 16px'}}>
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

    {contacts && contacts.map((contact: any) => (
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {contact.name}
              </Typography>
              <Typography variant="h5" component="div">
                {contact.phone}
              </Typography>
            </CardContent>
            <CardActions>
              <button onClick={() => deleteContact(contact.id)}>Delete</button>
            </CardActions>
          </Card>
        </div>
      </div>
    ))}

    </div>
  </div>
</div>
);
}