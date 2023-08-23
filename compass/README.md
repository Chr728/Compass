## Getting Started

### Clone the repo
```bash 
git clone https://github.com/janong24/Compass.git
```

Please make sure you have the node installed first

### Run the next project
The [Next.js](https://nextjs.org/) project is bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

change the dir to the next app:
```bash
cd compass
```

If this is your first time running the project, first install the dependencies:
```bash
npm install
```
Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Run the local firebase emulator for functions
Please make sure you have the firebase CLI installed first
```bash
npm install -g firebase-tools
```

change the dir to the firebase functions:
```bash
cd functions
```

If this is your first time running the project, first install the dependencies:
```bash
npm install
```
Then run the firebase emulator:

```bash
npm run serve
```
Enter the link given in your terminal into your browser, you will be able to see the emulator UI. Click Functions emulator to check all the functions and each endpoint.
