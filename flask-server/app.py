from flask import Flask, jsonify, request, session
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import random
from threading import Lock
app = Flask(__name__)
CORS(app,resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app, cors_allowed_origins = "*")

thread=None
thread_lock=Lock()
Machinedata = [
        {"machine_name": "ohhhhh", "status": "Running", "health": "Good", "zone": "Zone 1"},
        {"machine_name": "yehhh", "status": "Stopped", "health": "Fair", "zone": "Zone 2"},
        {"machine_name": "come on", "status": "Maintenance", "health": "Poor", "zone": "Zone 3"},
        {"machine_name": "ooo", "status": "Maintenance", "health": "Poor", "zone": "Zone 3"}
    ]

def background_thread():
    while True:
        for machine in Machinedata:
            machine['health']=random.choice(["Good","Bad","Ok"])
            machine['status']=random.choice(["Running","Stopped","Idle"])
            print("Updated machine data:",Machinedata)
            socketio.emit('sent_data',{"machine":Machinedata})
            socketio.sleep(5)

def call():
    print('Helo Arthur')
    value = { 'message' : 'HeL0 Arthur'}
    return value

@app.route('/home', methods=['GET'])
def home():
    res = call()
    return jsonify(res)

# @app.route('/dashboard', methods=['GET'])
# def dashboard():
#     data = [
#         {"machine_name": "Machine A", "status": "Running", "health": "Good", "zone": "Zone 1"},
#         {"machine_name": "Machine B", "status": "Stopped", "health": "Fair", "zone": "Zone 2"},
#         {"machine_name": "Machine C", "status": "Maintenance", "health": "Poor", "zone": "Zone 3"},
#         {"machine_name": "Machine D", "status": "Maintenance", "health": "Poor", "zone": "Zone 3"}
#     ]
#     return jsonify(data)

@socketio.on('dashboard')
def socket_event(data):
    print("Data recieved : ", data)
    emit("sent_data", {"machine" : Machinedata} , broadcast=True)

@socketio.on('connect')
def connect():
    global thread
    print('client connected')

    global thread
    with thread_lock:
        if thread is None:
            thread=socketio.start_background_task(background_thread)

if __name__ == '__main__':
    socketio.run(app,port = 5007, debug=True)
