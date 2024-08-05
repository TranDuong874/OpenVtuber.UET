# coding: utf-8

import numpy as np
import service
import cv2
import sys
import socketio
import json
import time
from threading import Thread
from queue import Queue

cap = cv2.VideoCapture(sys.argv[1])
fps = cap.get(cv2.CAP_PROP_FPS)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

fd = service.UltraLightFaceDetecion("weights/RFB-320.tflite",
                                    conf_threshold=0.98)
fa = service.CoordinateAlignmentModel("weights/coor_2d106.tflite")
hp = service.HeadPoseEstimator("weights/head_pose_object_points.npy",
                               cap.get(3), cap.get(4))
gs = service.IrisLocalizationModel("weights/iris_localization.tflite")

FPS = 30
    
def face_detection(cap):
    box_list = []
    
    while True:
        ret, frame = cap.read()
        
        if not ret:
            break
            
        face_boxes, _ = fd.inference(frame)
        
        box_list.append((frame, face_boxes))
    
    return box_list

def face_alignment(box_list):
    landmarks_list = []
    for (frame, boxes) in box_list:
        landmarks_generator = fa.get_landmarks(frame, boxes)
        landmarks = [landmark for landmark in landmarks_generator]  # Collect items from the generator
        
        landmarks = np.array(landmarks)  # Convert the list of landmarks to a NumPy array
        landmarks = landmarks.reshape(-1, 2)
        if len(landmarks == 106):
            landmarks_list.append((frame, landmarks))
            
    return landmarks_list


def iris_localization(landmarks_list):
    facial_list = []
    for frame, landmarks in landmarks_list:
        euler_angle = hp.get_head_pose(landmarks).flatten()
        facial_list.append((frame, landmarks, euler_angle))
    return facial_list

def draw(facial_list, output_video='output.mp4', color=(125, 255, 0), thickness=2):
    fourcc = cv2.VideoWriter_fourcc(*'H264')
    out = cv2.VideoWriter(output_video, fourcc, FPS, (960, 720))
    
    for (frame, landmarks, euler_angle) in facial_list:
        for idx, p in enumerate(np.round(landmarks).astype(np.int32)):
            cv2.circle(frame, tuple(p), 1, color, thickness, cv2.LINE_AA)
            cv2.putText(frame, str(idx), tuple(p), cv2.FONT_HERSHEY_SIMPLEX, 0.25, color, 1, cv2.LINE_AA)

        face_center = np.mean(landmarks, axis=0)
        hp.draw_axis(frame, euler_angle, face_center)
        
        frame = cv2.resize(frame, (960, 720))
        
        if (frame is not None):
            out.write(frame)
        cv2.imshow('result', frame)
        cv2.waitKey(1)
    
    out.release()
    
box_list = face_detection(cap)
landmarks_list = face_alignment(box_list)
facial_list = iris_localization(landmarks_list)

def serialize_facial(facial_list):
    result_dict = {}
    
    for idx, (frame, landmarks, euler_angle) in enumerate(facial_list):
        index_list = []
        landmark_coord = []
        
        for index, coordinate in enumerate(landmarks):
            index_list.append(index)
            landmark_coord.append(coordinate.tolist())
            
        entry = {
            "landmarks": landmark_coord, 
            "euler_angle": {
                "x": euler_angle[0],
                "y": euler_angle[1],
                "z": euler_angle[2]
            }
        }
        result_dict[str(idx)] = entry
    result_dict["landmark_index"] = index_list
    result_dict["landmark_count"] = len(index_list)
    result_dict["frame_count"] = len(facial_list)
    result_dict["fps"] = FPS

    return json.dumps(result_dict, indent=4)

json_string = serialize_facial(facial_list)

with open('facial_data.json', 'w') as file:
    file.write(json_string)

draw(facial_list)

cap.release()
cv2.destroyAllWindows()
