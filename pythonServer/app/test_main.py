from fastapi.testclient import TestClient
from fastapi import HTTPException
import pytest
from unittest.mock import MagicMock

from .main import app
from . import main

client = TestClient(app)

def fake_predict(filename):
    raise Exception("new Exception")

original_predict= main.predict

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {'message': 'Hello World'}


def test_pill_predict_wrong_file_format():
    test_file = 'test_files/test.txt'
    files = {'file': ('test.txt', open(test_file, 'rb'))}
    response = client.post('/PillAI', files=files)
    assert response.status_code == 404
    assert response.json() == {"message": "Image format must jpg, jpeg or png!"}


def test_pill_predict():
    test_file = 'test_files/0.jpg'
    files = {'file': ('0.jpg', open(test_file, 'rb'))}
    response = client.post('/PillAI', files=files)
    assert response.status_code == 200
    assert response.json() == {"prediction": "your prediction", 
                               "filename": "0.jpg"}
    
def test_test():
    main.predict=fake_predict
    test_file = 'test_files/0.jpg'
    files = {'file': ('0.jpg', open(test_file, 'rb'))}
    response = client.post('/PillAI', files=files)
    assert response.status_code == 400
    assert response.json() == {'detail': 'Exception was raised: new Exception'}
    main.predict=original_predict



