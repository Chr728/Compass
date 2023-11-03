<p align="center">
   <h1 align="center">Compass</h3>
</p> 
<p align="center">
    A Wellness app for people of age 40+
</p>

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![cypress](https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e)
![express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![postgresql](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## Getting Started

### Clone the repo
```bash 
git clone https://github.com/janong24/Compass.git
```

- Please make sure you have the nodeJs, the PostgreSQL, and the docker installed first
  
- Docker Desktop is recommended to help with managing the container, images, and volumns

- Check your computer to make sure that the port 3000, 8000 and 5432 are not occupied and the PostgreSQL server is not currently running on your local machine  

### Add the credential files in the right places, you should have 3 in total: 
- one .env in the root folder
- one .env in the client folder
- a serviceAccountKey.json in the server folder  

#### In the .env file in the root folder (Compass folder), you should have the following variables:
```bash
SERVER_DEV_PORT=8000
CLIENT_DEV_PORT=3000
DB_USER=admin
DB_PASS=admin
DB_NAME=compass
DB_PORT=5432
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_NEXT_PUBLIC_FIREBASE_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_NEXT_PUBLIC_FIREBASE_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_NEXT_PUBLIC_FIREBASE_APP_ID"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"
VAPID_PUBLIC_KEY="YOUR_VAPID_PUBLIC_KEY"
VAPID_PRIVATE_KEY="YOUR_VAPID_PRIVATE_KEY"
```
#### In the .env file in the client folder, you should have the following variables:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_NEXT_PUBLIC_FIREBASE_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_NEXT_PUBLIC_FIREBASE_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_NEXT_PUBLIC_FIREBASE_APP_ID"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"
NEXT_PUBLIC_API_URL="http://localhost:8000"
```
#### In serviceAccountKey.json file in the server folder, you should have the following variables:
```bash
{"type": "service_account",
  "project_id": "YOUR_project_id",
  "private_key_id": "YOUR_private_key_id",
  "private_key": "YOUR_private_key",
  "client_email": "YOUR_client_email",
  "client_id": "YOUR_client_id",
  "auth_uri": "YOUR_auth_uri",
  "token_uri": "YOUR_token_uri",
  "auth_provider_x509_cert_url": "YOUR_auth_provider_x509_cert_url",
  "client_x509_cert_url": "YOUR_client_x509_cert_url",
  "universe_domain": "YOUR_universe_domain"}
```
This project uses the firebase authorization, therefore you can get those credentials from your Firebase project. If you want to access the team's firebase project, please contact the team leader.

### Build and run the development version of the project

The docker file contains the commands to build and run the project. Please cd to the root folder (the Compass folder) and run:    

```bash
docker-compose -f docker-compose-dev.yml up
```
If you are running the project in your local environment, the server will be hosted on port 8000, the client will be hosted on port 3000 and the database will be hosted on post 5432  

Once you see 'Database synchronized' is printed in the terminal, the preparation is done. If you want to check the database, you can either use the terminal or the Postgresql GUI like Pgadmin4 to see if all the tables/data exist in your database. Since the whole project is containerized, the database in the container is the not one you have locally. It can only be connected if the docker container is running. Please make sure to connect to the DB inside of the container instead of other local databases.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#### If you add new packages or find that there's package update from the release which can cause 'having module not found' error
Please rebuild the docker images. To do that you may need to delete the container and all the related volumes.

#### Instruction for testing the backend API by sending requests:  

Since the API routes are protected, each request needs to contain a valid token now. You can either send the request to the firebase api to get the idToken, or use the script in server folder (server/utils/tokenGenerator.ts). If you want to use the script, follow the steps:  
- First please have the ts-node installed:
```bash
npm install -g ts-node
```
- Second, please get an valid uid (you can pick any uid in your firestore)  
- Third, change the dir to server/utils and run the command:
```bash
ts-node tokenGenerator.ts ANY_UID_HERE
```
- When sending the requests, add this in the request head
```bash
Authorization:  Bearer token_here 
```
#### If you meet other problems, please contact the team leader

## Description

Compass is a medical wellness app that targets specifically people above 40 years old who might  be interested in having  some  type of assistance to keep their healthy habits and lifestyles. Compass offers features of managing medical  reminders, booking appointments,tracking user’s medications and treatments  all in one consolidated application. In addition, having features of medical journals such as diabetic journals allows some patients to easily note their daily doses and treatment details making them able to follow the history of their treatments and use it as a reference for themselves or to show to their medical professional. Additionally,with the speed dial fast option to contact relatives during some emergency situations patients would be able to contact their relatives in a faster and easier way. With many features compass aims for users to be healthier and function hassle free. 

## Contributors

| Name                   | Student ID | GitHub                                          |
| ---------------------- | ---------- | ----------------------------------------------- |
| Christina Darstbanian  | 40097340   | [Chr728](https://github.com/Chr728)             |
| Imran Ahmed            | 40172931   | [imran1289-ah](https://github.com/imran1289-ah) |
| Xavier Morgan-Tracy    | 40129775   | [XavierKMT](https://github.com/XavierKMT)       |
| Jiayi Chen             | 40110997   | [JIAYI615](https://github.com/JIAYI615)         |
| Divleen Kaur Ahluwalia | 40116121   | [Divleen12](https://github.com/Divleen12)       |
| Jan Mikhail Alexei Ong | 40154849   | [janong24](https://github.com/janong24)         |
| Julien Phan            | 40133814   | [MrMelon1232](https://github.com/MrMelon1232)   |
| Adir Ben-David         | 40190551   | [beezzyy](https://github.com/beezzyy)           |
| Jonathan Abitbol       | 40190550   | [yoniabitbol](https://github.com/yoniabitbol)   |
| Reuven Ostrofsky       | 40188881   | [Reuven1203](https://github.com/Reuven1203)     |

## Tech Stack

**Front End**

- NextJS
- Tailwind CSS

**Back End**

- NodeJS
- Express
- Firebase Authentication
- PostgreSQL

**DevOps and Testing**

- Docker
- Jest
- Supertest
- Cypress

## Core Features

- Registration, Authentication and Security
- View and Add Appointments
- View and Add Medications
- Personal Diabetes, Food intake, Activity, Weight and Mood Journals
- Push Notifications for Reminders
- Speed dial to family, caregivers and emergency

## License

The application is under the GNU Affero General Public v3.0 License. See [LICENSE](https://github.com/janong24/Compass/blob/main/LICENSE) for more details
