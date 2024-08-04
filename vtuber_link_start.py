# coding: utf-8

import numpy as np
import service
import cv2
import sys
import socketio

from threading import Thread
from queue import Queue


cap = cv2.VideoCapture(0)

fd = service.UltraLightFaceDetecion("weights/RFB-320.tflite",
                                    conf_threshold=0.98)
fa = service.CoordinateAlignmentModel("weights/coor_2d106.tflite")
hp = service.HeadPoseEstimator("weights/head_pose_object_points.npy",
                               cap.get(3), cap.get(4))
gs = service.IrisLocalizationModel("weights/iris_localization.tflite")

QUEUE_BUFFER_SIZE = 18

box_queue = Queue(maxsize=QUEUE_BUFFER_SIZE)
landmark_queue = Queue(maxsize=QUEUE_BUFFER_SIZE)
iris_queue = Queue(maxsize=QUEUE_BUFFER_SIZE)
upstream_queue = Queue(maxsize=QUEUE_BUFFER_SIZE)

# ======================================================

def face_detection():
    while True:
        ret, frame = cap.read()

        if not ret:
            break

        face_boxes, _ = fd.inference(frame)
        box_queue.put((frame, face_boxes))


def face_alignment():
    while True:
        frame, boxes = box_queue.get()
        landmarks = fa.get_landmarks(frame, boxes)
        landmark_queue.put((frame, landmarks))


def iris_localization(YAW_THD=45):
    while True:
        frame, landmark_preds = landmark_queue.get()
        # print(frame, landmarks)
        count = 0
        for landmark in landmark_preds: # landmark_preds is generator giving the latest set of landmarks
            # calculate head pose
            print("------------------------------------------------")
            print(landmark)
            euler_angle = hp.get_head_pose(landmark).flatten()
            upstream_queue.put((frame, landmark, euler_angle))
            break

def draw(color=(125, 255, 0), thickness=2):
    while True:
        frame, landmarks, euler_angle = upstream_queue.get()

        for idx, p in enumerate(np.round(landmarks).astype(np.int32)):
            cv2.circle(frame, tuple(p), 1, color, thickness, cv2.LINE_AA)
            cv2.putText(frame, str(idx), tuple(p), cv2.FONT_HERSHEY_SIMPLEX, 0.25, color, 1, cv2.LINE_AA)

        face_center = np.mean(landmarks, axis=0)
        hp.draw_axis(frame, euler_angle, face_center)

        frame = cv2.resize(frame, (960, 720))

        cv2.imshow('result', frame)
        cv2.waitKey(1)

draw_thread = Thread(target=draw)
draw_thread.start()

iris_thread = Thread(target=iris_localization)
iris_thread.start()

alignment_thread = Thread(target=face_alignment)
alignment_thread.start()

face_detection()

cap.release()
cv2.destroyAllWindows()
