from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.json_util import dumps
import bcrypt

app = Flask(__name__)

# MongoDB connection string for local MongoDB instance
app.config["MONGO_URI"] = "mongodb://localhost:27017/UserDB"

mongo = PyMongo(app)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

users_collection = mongo.db.users
@app.route("/", methods=["GET"])
def welcome():
    return "Welcome to Flask Backend Server"

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")

        # Search for the user by email or username
        user = users_collection.find_one({"email": email}) or users_collection.find_one({"username": username})

        if user:
            if bcrypt.checkpw(password.encode('utf-8'), user["password"]):
                print("Login Successful")
                return jsonify({"message": "Login Success", "username": user["username"]})
            else:
                print("Invalid password")
                return jsonify({"message": "Invalid Password"}), 401
        else:
            print("Account doesn't exist")
            return jsonify({"message": "Account Doesn't Exist"}), 404
    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"message": "An error occurred during login"}), 500

@app.route("/signup", methods=["POST"])
def signup():
    try:
        # Get the request data
        data = request.json
        email = data.get("email")
        fullname = data.get("fullname")
        username = data.get("username")
        password = data.get("password")
        confirmpassword = data.get("confirmpassword")

        # Check if user already exists by email or username
        existing_user = users_collection.find_one({"email": email}) or users_collection.find_one({"username": username})
        if existing_user:
            return jsonify({"message": "Account already exists!"}), 409

        # Check if passwords match
        if password != confirmpassword:
            return jsonify({"message": "Passwords don't match"}), 400

        # Hash the password using bcrypt
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Create a new user document
        new_user = {
            "email": email,
            "fullname": fullname,
            "username": username,
            "password": hashed_password,  # Store hashed password
        }

        # Insert the user into the MongoDB collection
        users_collection.insert_one(new_user)
        return jsonify({"message": "Sign Up Successful"}), 201
    except Exception as e:
        print(f"Error during signup: {e}")
        return jsonify({"message": "An error occurred during signup"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
