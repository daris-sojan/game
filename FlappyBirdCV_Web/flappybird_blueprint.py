from flask import Blueprint, render_template
import cv2 as cv
import mediapipe as mp
import base64
import numpy as np
import time
import random
from collections import deque

flappybird_bp = Blueprint('flappybird', __name__, template_folder='templates')

# MediaPipe setup
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Game state
class GameState:
    def __init__(self):
        self.reset()
    def reset(self):
        self.window_size = (800, 600)
        self.bird_x = self.window_size[0] // 6
        self.bird_y = self.window_size[1] // 2
        self.bird_width = 40
        self.bird_height = 30
        self.pipes = deque()
        self.score = 0
        self.stage = 1
        self.game_running = True
        self.game_clock = time.time()
        self.pipe_spawn_timer = 0
        self.time_between_pipe_spawn = 40
        self.dist_between_pipes = 500
        self.space_between_pipes = 200
        self.pipe_width = 80
        self.pipe_height = 400
        self.did_update_score = False
    def get_pipe_velocity(self):
        return self.dist_between_pipes / self.time_between_pipe_spawn
    def update(self, nose_y=None):
        if not self.game_running:
            return
        if nose_y is not None:
            self.bird_y = (nose_y - 0.5) * 1.5 * self.window_size[1] + self.window_size[1]/2
            self.bird_y = max(0, min(self.window_size[1] - self.bird_height, self.bird_y))
        pipe_velocity = self.get_pipe_velocity()
        for pipe in self.pipes:
            pipe['x'] -= pipe_velocity
        if self.pipes and self.pipes[0]['x'] + self.pipe_width < 0:
            self.pipes.popleft()
        checker = True
        for pipe in self.pipes:
            if pipe['x'] <= self.bird_x <= pipe['x'] + self.pipe_width:
                checker = False
                if not self.did_update_score:
                    self.score += 1
                    self.did_update_score = True
        if checker:
            self.did_update_score = False
        for pipe in self.pipes:
            if (self.bird_x < pipe['x'] + self.pipe_width and \
                self.bird_x + self.bird_width > pipe['x'] and
                self.bird_y < pipe['top_height']):
                self.game_running = False
                return
            if (self.bird_x < pipe['x'] + self.pipe_width and \
                self.bird_x + self.bird_width > pipe['x'] and
                self.bird_y + self.bird_height > pipe['bottom_y']):
                self.game_running = False
                return
        if self.pipe_spawn_timer == 0:
            gap_y = random.randint(100, self.window_size[1] - self.space_between_pipes - 100)
            new_pipe = {
                'x': self.window_size[0],
                'top_height': gap_y,
                'bottom_y': gap_y + self.space_between_pipes
            }
            self.pipes.append(new_pipe)
        self.pipe_spawn_timer += 1
        if self.pipe_spawn_timer >= self.time_between_pipe_spawn:
            self.pipe_spawn_timer = 0
        if time.time() - self.game_clock >= 10:
            self.time_between_pipe_spawn = max(20, int(self.time_between_pipe_spawn * 5 / 6))
            self.stage += 1
            self.game_clock = time.time()
    def get_state(self):
        return {
            'bird_x': self.bird_x,
            'bird_y': self.bird_y,
            'bird_width': self.bird_width,
            'bird_height': self.bird_height,
            'pipes': list(self.pipes),
            'score': self.score,
            'stage': self.stage,
            'game_running': self.game_running,
            'window_size': self.window_size,
            'pipe_width': self.pipe_width
        }
game_state = GameState()

@flappybird_bp.route('/flappybird')
def flappybird_home():
    return render_template('flappybird.html')

def register_socketio_events(socketio):
    @socketio.on('connect')
    def handle_connect():
        print('Client connected (FlappyBird)')
        socketio.emit('game_state', game_state.get_state())

    @socketio.on('disconnect')
    def handle_disconnect():
        print('Client disconnected (FlappyBird)')

    @socketio.on('reset_game')
    def handle_reset_game():
        global game_state
        game_state.reset()
        socketio.emit('game_state', game_state.get_state())

    @socketio.on('video_frame')
    def handle_video_frame(data):
        try:
            image_data = base64.b64decode(data['image'].split(',')[1])
            nparr = np.frombuffer(image_data, np.uint8)
            frame = cv.imdecode(nparr, cv.IMREAD_COLOR)
            if frame is not None:
                frame_rgb = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
                results = face_mesh.process(frame_rgb)
                nose_y = None
                if results.multi_face_landmarks and len(results.multi_face_landmarks) > 0:
                    nose_landmark = results.multi_face_landmarks[0].landmark[94]
                    nose_y = nose_landmark.y
                game_state.update(nose_y)
                socketio.emit('game_state', game_state.get_state())
        except Exception as e:
            print(f"Error processing video frame: {e}") 