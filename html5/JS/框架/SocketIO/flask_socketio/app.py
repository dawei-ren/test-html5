from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
import random



async_mode = None
app = Flask(__name__)


app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

 
@app.route('/test')
def test():
    return render_template('test.html')



@socketio.on('test message', namespace='/test_conn')
def handle_test_message(message):
    print('-----------------', message)
    emit('test', message)

@socketio.on('message')
def handle_message(msg):
    print('received message: ' + msg)
    send(msg)

 
if __name__ == '__main__':
    socketio.run(app,host='0.0.0.0', debug=True)

