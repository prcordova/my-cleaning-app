import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { Button, CircularProgress, Typography, Box } from "@mui/material";

const FaceVerification = ({ onVerified }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      setIsLoading(false);
    };

    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error accessing webcam: ", err));
  };

  const handleVideoPlay = async () => {
    const labeledFaceDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const results = detections.map((d) =>
        faceMatcher.findBestMatch(d.descriptor)
      );

      if (results.some((result) => result.label !== "unknown")) {
        setIsVerified(true);
        onVerified(true);
      }
    }, 1000);
  };

  const loadLabeledImages = () => {
    const labels = ["User"]; // Replace with actual user label
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 1; i++) {
          const img = await faceapi.fetchImage(`/images/${label}/${i}.jpg`);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  };

  const captureImage = async () => {
    setIsCapturing(true);
    const canvas = faceapi.createCanvasFromMedia(videoRef.current);
    canvasRef.current.innerHTML = "";
    canvasRef.current.append(canvas);
    const displaySize = {
      width: videoRef.current.width,
      height: videoRef.current.height,
    };
    faceapi.matchDimensions(canvas, displaySize);
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    setIsCapturing(false);
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              onPlay={handleVideoPlay}
              width="720"
              height="560"
              style={{
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Box
              ref={canvasRef}
              sx={{ position: "absolute", top: 0, left: 0 }}
            />
          </Box>
          {isVerified && (
            <Typography variant="h6" color="success.main" sx={{ mt: 2 }}>
              Face verified successfully!
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={startVideo}
            sx={{ mt: 2 }}
          >
            Start Video
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={captureImage}
            sx={{ mt: 2, ml: 2 }}
            disabled={isCapturing}
          >
            {isCapturing ? "Capturing..." : "Capture Image"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FaceVerification;
