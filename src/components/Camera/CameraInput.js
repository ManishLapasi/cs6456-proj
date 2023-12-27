import React, { useState , useRef, useEffect} from "react";
import { GestureRecognizer, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";


let gestureRecognizer;
let gestureRecognizer2;
let runningMode = "IMAGE";
let enableWebcamButton;
let webcamRunning = false;
const videoHeight = "175px";
const videoWidth = "270px";

function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task", //OG mediapipe 7 gesture recognizer
            //modelAssetPath: "./models/ASL_recognizer_offl.task", //to recognize alphabets, del, space.
            delegate: "GPU"
        },
        runningMode: runningMode
    });
};

const createGestureRecognizer2 = async () => {
    const vision2 = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
    gestureRecognizer2 = await GestureRecognizer.createFromOptions(vision2, {
        baseOptions: {
            // modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task", //OG mediapipe 7 gesture recognizer
            modelAssetPath: "./models/ASL_recognizer_offl.task", //to recognize alphabets, del, space.
            delegate: "GPU"
        },
        runningMode: runningMode
    });
};

createGestureRecognizer();
console.log("loading...");
createGestureRecognizer2();
console.log("loading 2...");

let lastVideoTime = -1;
let results = undefined;
let results2 = undefined;

let leftSoFar = [];
let rightSoFar = [];
let batchToKeep = 1;
let rightConfidenceThreshold = 55;
let leftConfidenceThreshold = 60;

function CameraInput({ leftCategoryName, setLeftCategoryName, rightCategoryName, setRightCategoryName, noteMode}) {

    const [webcamRunning, setWebcamRunning] = useState(false);

    async function predictWebcam() {
        if (webcamRunning) {
            const webcamElement = document.getElementById("webcam");
            const gestureOutput1 = document.getElementById("gesture_output_1");
            const gestureOutput2 = document.getElementById("gesture_output_2");
            if (runningMode === "IMAGE") {
                runningMode = "VIDEO";
                await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
                await gestureRecognizer2.setOptions({ runningMode: "VIDEO" });
            }
            let nowInMs = Date.now();
            if (webcamElement.currentTime !== lastVideoTime) {
                lastVideoTime = webcamElement.currentTime;
                results = gestureRecognizer.recognizeForVideo(webcamElement, nowInMs);
                results2 = gestureRecognizer2.recognizeForVideo(webcamElement, nowInMs);
            }
            if (results.gestures.length == 0) {
                gestureOutput1.innerText = `Navigation Model: Unrecognized\n Confidence: Unknown`;
                gestureOutput2.innerText = `ASL model: Unrecognized\n Confidence: Unknown`;
                gestureOutput1.style.color = "rgb(211,211,211)"
                gestureOutput2.style.color = "rgb(211,211,211)"
            }
            // else if (!noteMode) {
            //     var newcategoryName = results.gestures[0][0].categoryName;
            //     var newcategoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
            //     var gesture1handedness = results.handednesses[0][0].displayName;
            //     console.log(gesture1handedness);
            //     if (gesture1handedness == "Right" && newcategoryName != leftCategoryName) {
            //         setLeftCategoryName(newcategoryName);
            //     }
            //     gestureOutput.innerText = `GestureRecognizer: ${newcategoryName}\n Confidence: ${newcategoryScore}`;
            // }
            //else if (noteMode) {
            else {
                var newcategoryName = results.gestures[0][0].categoryName;
                var newcategoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
                var gesture1handedness = results.handednesses[0][0].displayName;
                if (results2 && results2.gestures.length > 0) {
                    var newcategoryName2 = results2.gestures[0][0].categoryName;
                    var newcategoryScore2 = parseFloat(results2.gestures[0][0].score * 100).toFixed(2);
                    var gesture2handedness = results2.handednesses[0][0].displayName;
                    if (gesture1handedness == "Right" && newcategoryScore >= leftConfidenceThreshold) {
                        leftSoFar.push(newcategoryName);
                        if (leftSoFar.length > batchToKeep) {leftSoFar.shift()}
                        if (new Set(leftSoFar).size==1) {
                            setLeftCategoryName(newcategoryName);
                        }
                    }
                    if (gesture2handedness == "Left" && newcategoryScore2 >= rightConfidenceThreshold) {
                        rightSoFar.push(newcategoryName2);
                        if (rightSoFar.length > batchToKeep) {rightSoFar.shift()}
                        if (new Set(rightSoFar).size==1) {
                            setRightCategoryName(newcategoryName2);
                        }
                    }
                    // else if (newcategoryScore > newcategoryScore2) {
                    //     setLeftCategoryName(newcategoryName)
                    // }
                    // else {
                    //     setRightCategoryName(newcategoryName2)
                    // }
                    //gestureOutput.innerText = `GestureRecognizer: ${newcategoryName}\n Confidence: ${newcategoryScore} \n Gesture2: ${newcategoryName2}\n Score2: ${newcategoryScore2}`; //%\n Handedness: ${handedness}  //\n Gesture2: ${newcategoryName2}\n Score2: ${newcategoryScore2}
                    gestureOutput1.innerText = `Navigation Model: ${newcategoryName}\n Confidence: ${newcategoryScore}`
                    gestureOutput2.innerText = `ASL Model: ${newcategoryName2}\n Confidence: ${newcategoryScore2}`;
                    let d1 = newcategoryScore - leftConfidenceThreshold;
                    let d2 = newcategoryScore2 - rightConfidenceThreshold;
                    if (d1>20) {gestureOutput1.style.color = "black"}
                    else if (d1>0) {gestureOutput1.style.color = "rgb(211,211,211)"}
                    else {gestureOutput1.style.color = "rgb(211,211,211)"}
                    if (d2>20) {gestureOutput2.style.color = "black"}
                    else if (d2>0) {gestureOutput2.style.color = "rgb(211,211,211)"}
                    else {gestureOutput2.style.color = "rgb(211,211,211)"}
                }
                else {
                    if (gesture1handedness == "Right" && newcategoryName != leftCategoryName && newcategoryScore >= leftConfidenceThreshold) {
                        leftSoFar.push(newcategoryName);
                        if (leftSoFar.length > batchToKeep) {leftSoFar.shift()}
                        if (new Set(leftSoFar).size==1) {
                            setLeftCategoryName(newcategoryName);
                        }
                    }
                    gestureOutput1.innerText = `Navigation Model: ${newcategoryName}\n Confidence: ${newcategoryScore}`;
                    gestureOutput2.innerText = `ASL Model: Unrecognized\n Confidence: Unknown`;
                    let d1 = newcategoryScore - leftConfidenceThreshold;
                    if (d1>20) {gestureOutput1.style.color = "black"}
                    else if (d1>0) {gestureOutput1.style.color = "rgb(211,211,211)"}
                    else {gestureOutput1.style.color = "rgb(211,211,211)"}
                }
            }
        }
        window.requestAnimationFrame(predictWebcam);
    }

    window.requestAnimationFrame(predictWebcam);

    const webcamButtonClick = () => {
        console.log("width={270} height={175}")
        let video = document.getElementById("webcam");
        let enableWebcamButton = document.getElementById("webcamButton")
        if (webcamRunning === true) {
            enableWebcamButton.innerText = "ENABLE PREDICTIONS";
            const constraints = {
                video: true
            };
            navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                video.srcObject = null;
            });
            setWebcamRunning(false);
        }
        else {
            enableWebcamButton.innerText = "DISABLE PREDICTIONS";
            const constraints = {
                video: true
            };
            navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                video.srcObject = stream;
            });
            setWebcamRunning(true);
        }
    }

    return (
        <div className="camSection">
            <button id="webcamButton" onClick={() => webcamButtonClick()}>ENABLE WEBCAM</button>
            <div className="camView">
                {/* Camera View */}
                {/* //width: 270, height: 175, */}
                <video id="webcam" autoPlay playsInline width={"100%"} height={"100%"}></video> 
                {/* style="position: absolute; left: 0px; top: 0px;" */}
                {/* <CustomWebCam/> */}
            </div>
            <div className="camCommand">
                <p id="gesture_output_1" style={{color:"rgb(211,211,211)"}}>Navigation Model: <br/>Confidence:</p>
                <p id="gesture_output_2" style={{color:"rgb(211,211,211)"}}>ASL Model: <br/>Confidence:</p>
            </div>
        </div>

    )
}

export default CameraInput;