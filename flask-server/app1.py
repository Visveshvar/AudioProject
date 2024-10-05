from flask import Flask, jsonify, request, session
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from threading import Thread
import time
import random
import eventlet
import json

app = Flask(__name__)
CORS(app,resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app, cors_allowed_origins = "*")

Machinedata = [
        {"machine_name": "ohhh", "status": "Running", "health": "Good", "zone": "Zone 1"},
        {"machine_name": "yehhh", "status": "Stopped", "health": "Fair", "zone": "Zone 2"},
        {"machine_name": "Machine C", "status": "Maintenance", "health": "Poor", "zone": "Zone 3"},
        {"machine_name": "Machine D", "status": "Maintenance", "health": "Poor", "zone": "Zone 3"}
    ]

alert = {"alert" : "Machine 1 has issue"}

def update_machine_data():
    while True:
        eventlet.sleep(5) 
        for machine in  Machinedata:
            machine['health'] = random.choice(["Good", "Bad", "Ok"])  # Random health
            machine['status'] = random.choice(["Running", "Stopped", "Idle"])  # Random status
        print("Updated machine data:", Machinedata)
        socketio.emit('sent_data', {"machine": Machinedata})

        # Machinedata = getPrediction('audio/Grouped/01010.wav')
        # socketio.emit("sent_data", {"machine" : Machinedata})

def update_alert_data():
        time.sleep(3)
        alert['alert'] = random.choice(["Machine 1 has issue", "Machine 2 has issue", "Machine 3 has issue"])
        print("Updated alert data:",alert)
        socketio.emit("sent_datum", {"alert" : alert})

def call():
    print('Helo Arthur')
    value = { 'message' : 'HeL0 Arthur'}
    return value

@app.route('/home', methods=['GET'])
def home():
    res = call()
    return jsonify(res)

def generate_alerts():
    while True:
        eventlet.sleep(5)  # Wait for 5 seconds between alerts
        alert_message = {
            'message': f'Machine {random.randint(1, 5)} has encountered an issue!',
        }
        print(alert_message)
        # Emit the alert to all connected clients
        emit('alert', alert_message)


@socketio.on('connect')
def handle_connect():
    print('Client connected')
    socketio.emit("sent_data", {"machine": Machinedata})

@socketio.on('alert')
def start_alert_generation(data):
    print("Datum recieved : ",data)
    emit("sent_data", {"machine": Machinedata})
    print("Data sent")

@socketio.on('dashboard')
def socket_event(data):
    print("Data recieved : ", data)
    emit("sent_datum", {"alert" : "Alert 1 2 3,"})
    print("Data sent")

if __name__ == '__main__':
    Thread(target=update_machine_data, daemon=True).start()
    Thread(target=update_alert_data, daemon=True).start()
    socketio.run(app, port = 5007, debug=True)
