import json
from app import app

def test_register():
    client = app.test_client()
    headers = {'Content-Type': 'application/json'}
    payload = {
        'firstName': 'John',
        'lastName': 'Doe',
        'email': 'john.doe@example.com',
        'password': 'password123',
        'isTeacher': True
    }
    
    response = client.post('/register', headers=headers, data=json.dumps(payload))
    
    assert response.status_code == 200
    
    # Clean up the test data (optional)
    user = User.query.filter_by(email='john.doe@example.com').first()
    db.session.delete(user)
    db.session.commit()