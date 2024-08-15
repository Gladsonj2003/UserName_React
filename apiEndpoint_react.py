from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb+srv://Gladson:Gladson2016@gladson.qypfogn.mongodb.net/?retryWrites=true&w=majority&appName=Gladson')
db = client.userDB

# Define collections
user_details_collection = db.userDetails
user_auth_collection = db.userAuth

@app.route('/add_users', methods=['POST'])
def add_users():
    data = request.json

    if not data or 'firstName' not in data or 'lastName' not in data:
        return jsonify({"error": "Invalid input, expected 'firstName' and 'lastName' fields"}), 400

    user = {
        "firstName": data['firstName'],
        "lastName": data['lastName']
    }

    if user_details_collection.find_one({"firstName": data['firstName'], "lastName": data['lastName']}):
        return jsonify({"error": "User already exists"}), 400

    try:
        user_details_collection.insert_one(user)
        return jsonify({"message": "User details inserted successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_users', methods=['GET'])
def get_users():
    try:
        search_query = request.args.get('search', '')
        sort_order = request.args.get('sort', 'ascending')

        query = {}
        if search_query:
            query = {
                "$or": [
                    {"firstName": {"$regex": search_query, "$options": "i"}},
                    {"lastName": {"$regex": search_query, "$options": "i"}}
                ]
            }

        sort_field = [("firstName", 1)]  # Default sort: ascending
        if sort_order == 'descending':
            sort_field = [("firstName", -1)]  # Descending

        users = list(user_details_collection.find(query, {'_id': 0}).sort(sort_field))
        return jsonify({"users": users}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json

    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Invalid input, expected 'email' and 'password' fields"}), 400

    user = {
        "email": data['email'],
        "password": data['password']  # Be sure to hash passwords in production
    }

    try:
        user_auth_collection.insert_one(user)
        return jsonify({"message": "Account created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/login', methods=['POST'])
def login():
    data = request.json

    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Invalid input, expected 'email' and 'password' fields"}), 400

    user = user_auth_collection.find_one({"email": data['email']})

    if user and user.get('password') == data['password']:  # Be sure to hash and compare passwords securely
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json

    if not data or 'email' not in data or 'newPassword' not in data:
        return jsonify({"error": "Invalid input, expected 'email' and 'newPassword' fields"}), 400

    try:
        result = user_auth_collection.update_one(
            {"email": data['email']},
            {"$set": {"password": data['newPassword']}}  # Be sure to hash passwords in production
        )
        if result.matched_count:
            return jsonify({"message": "Password reset successfully"}), 200
        else:
            return jsonify({"error": "Email not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
