import { useRef, useState, useEffect, useCallback } from 'react'
import type { ChangeEvent } from 'react'
import Webcam from 'react-webcam'
import axios from 'axios'
import { Button } from '@/components/ui/button'

interface VideoRecorderProps {
  onClose: () => void
}

const VideoRecorder = ({ onClose }: VideoRecorderProps) => {
  const webcamRef = useRef<Webcam>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [recording, setRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [cameraReady, setCameraReady] = useState(false)
  const [recordingMimeType, setRecordingMimeType] = useState<string>('video/webm')

  // Get available camera devices
  const handleDevices = useCallback((mediaDevices: MediaDeviceInfo[]) => {
    const videoDevices = mediaDevices.filter(({ kind }) => kind === 'videoinput')
    setDevices(videoDevices)
    
    // Auto-select first device if none selected
    if (videoDevices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(videoDevices[0].deviceId)
    }
  }, [selectedDeviceId])

  useEffect(() => {
    // Request camera permissions and enumerate devices
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // After permission is granted, enumerate devices to get labels
        navigator.mediaDevices.enumerateDevices().then(handleDevices)
        // Stop all tracks to release camera after enumeration
        stream.getTracks().forEach(track => track.stop())
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err)
        setError('Camera permission denied or no camera found. Please check your camera settings.')
      })
  }, [handleDevices])

  const handleStartRecording = () => {
    setRecordedChunks([])
    if (webcamRef.current?.stream) {
      // Try to use MP4 format if supported, otherwise fall back to WebM
      const mimeTypes = [
        'video/mp4',
        'video/webm;codecs=h264',
        'video/webm',
      ]
      
      let selectedMimeType = 'video/webm' // default fallback
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType
          break
        }
      }
      
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: selectedMimeType
      })
      mediaRecorderRef.current.ondataavailable = handleDataAvailable
      mediaRecorderRef.current.start()
      setRecording(true)
      
      // Store the mime type for later use
      setRecordingMimeType(selectedMimeType)
    }
  }

  const handleDataAvailable = ({ data }: BlobEvent) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => [...prev, data])
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const handleUpload = async () => {
    if (recordedChunks.length) {
      // Determine file extension based on mime type
      let fileExtension = 'webm'
      if (recordingMimeType.includes('mp4')) {
        fileExtension = 'mp4'
      }
      
      const blob = new Blob(recordedChunks, {
        type: recordingMimeType
      })
      const formData = new FormData()
      formData.append('file', blob, `recording.${fileExtension}`)

      try {
        await axios.post('http://localhost:5000/upload/video', formData)
        onClose()
      } catch (error) {
        console.error('Error uploading video:', error)
      }
    }
  }

  // Handle webcam user media loaded
  const handleUserMedia = () => {
    setCameraReady(true)
    setError('')
  }

  // Handle webcam user media error
  const handleUserMediaError = (error: string | DOMException) => {
    console.error('Webcam error:', error)
    setCameraReady(false)
    setError('Failed to access camera. Please ensure camera permissions are granted and try refreshing the page.')
  }

  // Video constraints - more flexible to support various cameras
  const videoConstraints = {
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
    // Remove strict resolution requirements to support more cameras
    width: { ideal: 1280 },
    height: { ideal: 720 },
    // Remove facingMode to support all camera types including virtual cameras
  }

  return (
    <div className="flex w-full flex-col gap-4 bg-white py-6 rounded-xl">
      {/* Camera selection dropdown */}
      {devices.length > 0 && (
        <div className="w-full">
          <div className="text-sm mb-2">Select Camera:</div>
          <select
            value={selectedDeviceId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedDeviceId(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm"
          >
            <option value="">Select Camera</option>
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.substring(0, 8)}...`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="w-full p-3 rounded-md border border-red-200 bg-red-50">
          <div className="text-sm text-red-600">⚠️ {error}</div>
        </div>
      )}

      <div className="w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden relative">
        <Webcam
          audio={true}
          ref={webcamRef}
          width="100%"
          height="100%"
          videoConstraints={videoConstraints}
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
        />
        {!cameraReady && !error && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-lg">
            Loading camera...
          </div>
        )}
      </div>

      <div className="flex w-full gap-4">
        {!recording ? (
          <>
            <Button
              onClick={handleStartRecording}
              disabled={!cameraReady}
              className="flex-1 bg-red-500 text-white hover:bg-red-600"
            >
              Start Recording
            </Button>
            <Button variant="outline" onClick={onClose} className="border-gray-200">
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleStopRecording}
              className="flex-1 bg-gray-200 text-gray-900 hover:bg-gray-300"
            >
              Stop Recording
            </Button>
          </>
        )}
      </div>

      {recordedChunks.length > 0 && !recording && (
        <Button onClick={handleUpload} className="w-full bg-green-500 text-white hover:bg-green-600">
          Upload Video
        </Button>
      )}
    </div>
  )
}

export default VideoRecorder
