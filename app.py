"""Flask app for Cupcakes"""

from flask import Flask, request, jsonify, render_template

from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "secret"
app.app_context().push()

connect_db(app)

@app.route ('/api/cupcakes')
def list_cupcakes():
    """Returns list of all cupcakes with each cupcakes 
    information as a dictionary"""
    all_cupcakes = [cupcake.serialize() for cupcake in Cupcake.query.all()]
    return jsonify(cupcakes=all_cupcakes)

@app.route('/api/cupcakes/<int:id>')
def get_cupcake_info(id):
    """returns cupcake information based on id"""
    cupcake = Cupcake.query.get_or_404(id)
    return jsonify(cupcake = cupcake.serialize())

@app.route('/api/cupcakes', methods=['POST'])
def create_cupcake():
    """Create a new cupcake and return json of the created cupcake"""
    new_cupcake = Cupcake(flavor=request.json['flavor'], size=request.json['size'], 
    rating=request.json['rating'], image=request.json['image'] or None)

    db.session.add(new_cupcake)
    db.session.commit()
    cupcake=new_cupcake.serialize()
    res_json = jsonify(cupcake)
    return (res_json, 201)

@app.route('/api/cupcakes/<int:id>', methods=['PATCH'])
def update_cupcake(id):
    """update cupcake info an return updated cupcake as JSON"""
    cupcake = Cupcake.query.get_or_404(id)
    cupcake.flavor = request.json.get('flavor', cupcake.flavor)
    cupcake.size = request.json.get('size', cupcake.size)
    cupcake.rating = request.json.get('rating', cupcake.rating)
    cupcake.image = request.json.get('image', cupcake.image)
    db.session.add(cupcake)
    db.session.commit()
    return jsonify(cupcake=cupcake.serialize())


@app.route('/api/cupcakes/<int:id>', methods=['DELETE'])
def delete_cupcake(id):
    """deletes a specefied cupcake"""
    cupcake = Cupcake.query.get_or_404(id)
    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(message=f'Deleted {cupcake.flavor} cupcake')

@app.route('/')
def show_cupcakes_page():
    cupcakes = Cupcake.query.all()
    return render_template('index.html',cupcakes=cupcakes)
    
