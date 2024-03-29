from flask import Flask, render_template, request, jsonify
import niit.NeatEncoder as encoder
import niit.Neat as niit
app = Flask(__name__)
app.config['DEBUG'] = True
neat = None

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/flappy-bird', methods = ['GET', 'POST'])
def flappy_bird():
    global neat
    param  = request.args.get('param', None)

    if request.method == 'POST':
        for i in request.form.keys():
            print(i)
        encoder.decode_data(request.form)
        print("BEFORE EVOLUTION")
        for species in neat.species:
            print(species.score)
        neat.evolve()
        print("AFTER EVOLUTION")
        for species in neat.species:
            print(species.score)
        data = encoder.encode(neat.units)
        return data, 200

    if param == "1":
        neat = niit.Neat(5, 2, 100)
        f = app.open_resource("static/flappy-bird/flappy_bird_settings.txt", "r")
        neat.load_settings(f)
        for unit in neat.get_units():
            unit.get_genome().mutate_connection()
            unit.get_genome().mutate()
        data = encoder.encode(neat.units)
        return data
    return render_template("flappy-bird.html")

@app.route('/running-dino', methods = ['GET', 'POST'])
def running_dinosaur():
    global neat
    param  = request.args.get('param', None)

    if request.method == 'POST':
        encoder.decode_data(request.form)
        neat.evolve()
        data = encoder.encode(neat.units)
        return data, 200

    if param == "1":
        neat = niit.Neat(4, 3, 100)
        f = app.open_resource("static/running-dino/running_dino_settings.txt", "r")
        neat.load_settings(f)
        data = encoder.encode(neat.units)
        return data
    return render_template("/running-dino.html")

if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(debug=True, port=33507)