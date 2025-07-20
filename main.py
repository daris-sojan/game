from flask import Flask, render_template
from flask_socketio import SocketIO
from FlappyBirdCV_Web.flappybird_blueprint import flappybird_bp, register_socketio_events

app = Flask(__name__)
app.config['SECRET_KEY'] = 'flappy_bird_cv_secret'
socketio = SocketIO(app, cors_allowed_origins="*")

app.register_blueprint(flappybird_bp)
register_socketio_events(socketio)

@app.route('/')
def home():
    return render_template('main.html')

@app.route('/maze')
def maze():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app, debug=True) 