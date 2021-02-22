from flask import Flask, render_template, request, jsonify
import niit.NeatEncoder as encoder
import niit.Neat as niit
app = Flask(__name__)
neat = None

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/flappy-bird', methods = ['GET', 'POST'])
def flappy_bird():
    global neat
    param  = request.args.get('param', None)

    if request.method == 'POST':
        encoder.decode_data(request.form['data'])
        neat.evolve()
        data = encoder.encode(neat.units)
        return data, 200

    if param == "1":
        neat = niit.Neat(5, 2, 50)
        for unit in neat.get_units():
            unit.get_genome().mutate_connection()
            unit.get_genome().mutate()
        data = encoder.encode(neat.units)
        return data
    return render_template("flappy-bird.html")

@app.route('/running-dino')
def running_dinosaur():
    global neat
    param  = request.args.get('param', None)

    if request.method == 'POST':
        encoder.decode_data(request.form['data'])
        print("EVOLUTION BABY, EVOLUTION")
        neat.evolve()
        data = encoder.encode(neat.units)
        return data, 200

    if param == "1":
        neat = niit.Neat(4, 3, 70)
        for unit in neat.get_units():
            unit.get_genome().mutate_connection()
            unit.get_genome().mutate()
        data = encoder.encode(neat.units)
        return data
    return render_template("/running-dino.html")

if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(debug=True, port=33507)