from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb+srv://Gladson:Gladson2016@gladson.qypfogn.mongodb.net/?retryWrites=true&w=majority&appName=Gladson')
db = client.userDB
collection = db.userCollection

@app.route('/add_users', methods=['POST'])
def add_users():
    data = request.json

    if not data or 'firstName' not in data or 'lastName' not in data:
        return jsonify({"error": "Invalid input, expected 'firstName' and 'lastName' fields"}), 400

    user = {
        "firstName": data['firstName'],
        "lastName": data['lastName']
    }

    try:
        collection.insert_one(user)
        return jsonify({"message": "User inserted successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "API is running"}), 200

if __name__ == "__main__":
    app.run(debug=True)
