## Getting Started

### Clone the repo
```bash 
git clone https://github.com/janong24/Compass.git
```

Please make sure you have the nodeJs, the PostgreSQL, and the docker installed first  

Check your computer to make sure that the port 3000,8000 and 5432 are not occupied and the PostgreSQL server is not currently running  

Add the .env files in the right places, you should have 3 .env files in the root folder, the client folder, and the server folder

### Build and run the development version of the project

The docker file contains the commands to build and run the project  

```bash
docker-compose -f docker-compose-dev.yml up
```
If you are running the project in your local environment, the server will be hosted on port 8000, the client will be hosted on port 3000 and the database will be hosted on post 5432  

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
