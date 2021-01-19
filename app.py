from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/flappy-bird', methods = ['GET', 'POST'])
def flappy_bird():
    if request.method == 'POST':
        print("I got this: ")
        print(request.get_json())
        return "OK", 200
    return render_template("flappy-bird.html", data = {"something":"something2"})

@app.route('/running-dinosaur')
def running_dinosaur():
    return render_template("flappy-bird.html")

if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(debug=True)