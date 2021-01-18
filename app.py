from flask import Flask, render_template, request
app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/flappy-bird', methods = ['GET', 'POST'])
def flappy_bird():
    if request.method == 'POST':
        return "Nesto"
    return render_template("flappy-bird.html")

@app.route('/running-dinosaur')
def running_dinosaur():
    return render_template("flappy-bird.html")

if __name__ == "__main__":
    app.run()