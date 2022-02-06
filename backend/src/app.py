from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost/pythonreactdb'
mongo = PyMongo(app)

""" Creamos los CORS para las peticiones """
CORS(app)

db = mongo.db.users

""" Crear usuario """
@app.route('/user/create', methods=['POST'])
def createUser():
  userCreate = db.insert_one({
    'name': request.json['name'],
    'email': request.json['email'],
    'password': request.json['password'],
  })

  return jsonify(str(ObjectId(userCreate.inserted_id)))


""" Obtener todos los usuarios """
@app.route('/users', methods=['GET'])
def getUsers():
  users = []

  for doc in db.find():
    users.append({
      '_id': str(ObjectId(doc['_id'])),
      'name': doc['name'],
      'email': doc['email'],
      'password': doc['password'],
    })

  return jsonify(users)

""" Obtener un usuario por ID """
@app.route('/user/<id>', methods=['GET'])
def getUserById(id):
  user = db.find_one({'_id': ObjectId(id)},)
  return jsonify({
    '_id': str(ObjectId(user['_id'])),
    'name': user['name'],
    'email': user['email'],
    'password': user['password'],
  })


""" Eliminar un usuario """
@app.route('/user/delete/<id>', methods=['DELETE'])
def deleteUser(id):
  db.delete_one({'_id': ObjectId(id)})
  return jsonify({"message": 'User Deleted'})


""" Modificar un usuario """
@app.route('/user/update/<id>', methods=['PUT'])
def updateUser(id):
  db.update_one({'_id': ObjectId(id)}, {'$set': {
    'name': request.json['name'],
    'email': request.json['email'],
    'password': request.json['password'],
  }})

  user = db.find_one({'_id': ObjectId(id)})

  return jsonify({
    "message": 'User Updated',
    'userUpdated': {
      '_id': str(ObjectId(user['_id'])),
      'name': user['name'],
      'email': user['email'],
      'password': user['password'],
    },
  })


if __name__ == '__main__':
  app.run(debug=True)
