from fastapi import FastAPI
import uvicorn

app = FastAPI()


@app.get("/", status_code=200)
async def read_root():
    return {'message': 'Hello World'}

if __name__ == "__main__":
    uvicorn.run(app, debug=True)