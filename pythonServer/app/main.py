from fastapi import FastAPI
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

PYTHON_PORT = int(os.getenv("PYTHON_PORT"))
PYTHON_HOST = os.getenv("PYTHON_HOST")

app = FastAPI()


@app.get("/", status_code=200)
async def read_root():
    return {'message': 'Hello World'}

if __name__ == "__main__":
    uvicorn.run(app, host=PYTHON_HOST, port =PYTHON_PORT)