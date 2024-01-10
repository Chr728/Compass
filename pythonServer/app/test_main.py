from fastapi.testclient import TestClient
from fastapi import HTTPException
import pytest
from unittest.mock import MagicMock

from .main import app
from . import main

client = TestClient(app)

sample_output = {
    "predictions": [
        {
            "score": 4.124554634094238,
            "class_label": "nematode, nematode worm, roundworm"
        },
        {
            "score": 3.9820611476898193,
            "class_label": "matchstick"
        },
        {
            "score": 3.347282886505127,
            "class_label": "revolver, six-gun, six-shooter"
        },
        {
            "score": 3.32959246635437,
            "class_label": "bassoon"
        },
        {
            "score": 3.3281443119049072,
            "class_label": "oboe, hautboy, hautbois"
        }
    ],
    "filename": "0.jpg"
}

def fake_predict(filename):
    raise Exception("new Exception")

original_predict= main.predict

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {'message': 'Hello World'}


def test_pill_predict_wrong_file_format():
    test_file = './test_files/test.txt'
    files = {'file': ('test.txt', open(test_file, 'rb'))}
    response = client.post('/PillAI', files=files)
    assert response.status_code == 400
    assert response.json() == {"message": "Image format must be jpg, jpeg, or png!"}


def test_pill_predict():
    test_file = './test_files/0.jpg'
    files = {'file': ('0.jpg', open(test_file, 'rb'))}
    response = client.post('/PillAI', files=files)
    assert response.status_code == 200
    assert response.json() == sample_output
    
def test_test():
    main.predict=fake_predict
    test_file = './test_files/0.jpg'
    files = {'file': ('0.jpg', open(test_file, 'rb'))}
    response = client.post('/PillAI', files=files)
    assert response.status_code == 500
    assert response.json() == {'detail': 'Error: new Exception'}
    main.predict=original_predict



