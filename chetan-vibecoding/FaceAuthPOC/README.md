# 🔐 Face Recognition Auth POC

A proof-of-concept facial recognition authentication system built with ASP.NET Core and face-api.js.

## ✨ Features

- **Face Registration**: Register users using webcam facial capture
- **Face Login**: Authenticate users via facial recognition
- **Real-time Detection**: Live face detection with visual feedback
- **Confidence Scoring**: Shows match confidence percentage
- **Clean UI**: Modern, responsive interface with smooth animations

## 🏗️ Architecture

### Frontend
- HTML5 + CSS3 + Vanilla JavaScript
- face-api.js (via CDN) for face detection & recognition
- Browser webcam access via getUserMedia API
- Face descriptor extraction (128-dimensional embeddings)

### Backend
- ASP.NET Core 6.0 Web API
- In-memory storage (static list)
- Euclidean distance calculation for face matching
- RESTful API endpoints

## 📋 Prerequisites

- .NET 6.0 SDK or higher
- Modern web browser (Chrome recommended)
- Webcam

## 🚀 Quick Start

### 1. Navigate to Project Directory
```bash
cd FaceAuthPOC
```

### 2. Restore Dependencies
```bash
dotnet restore
```

### 3. Run the Application
```bash
dotnet run
```

### 4. Open in Browser
Navigate to: `http://localhost:5000` or `https://localhost:5001`

## 📖 How to Use

### Registration
1. Click **"Register with Face"**
2. Allow camera access when prompted
3. Position your face in the frame
4. Wait for green box to appear (face detected)
5. Click **"Capture & Process"**
6. Success message will confirm registration

### Login
1. Click **"Login with Face"**
2. Position your face in the frame
3. Click **"Capture & Process"**
4. System compares your face with registered face
5. Success/failure message with confidence score

## 🔧 API Endpoints

### POST /api/faceauth/register
Register a new user with face descriptor.

**Request Body:**
```json
{
  "username": "Demo User",
  "descriptor": [0.123, -0.456, ...] // 128 floats
}
```

**Response:**
```json
{
  "success": true,
  "message": "Face registered successfully!",
  "username": "Demo User"
}
```

### POST /api/faceauth/login
Authenticate user with face descriptor.

**Request Body:**
```json
{
  "descriptor": [0.123, -0.456, ...] // 128 floats
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful!",
  "confidence": 87.5,
  "username": "Demo User"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "message": "Face not recognized. Please try again.",
  "confidence": 45.2
}
```

### GET /api/faceauth/status
Check if a user is registered.

**Response:**
```json
{
  "registered": true,
  "userCount": 1,
  "username": "Demo User"
}
```

## 🎯 Technical Details

### Face Matching Algorithm
- **Method**: Euclidean distance between 128D face descriptors
- **Threshold**: 0.6 (lower = stricter matching)
- **Formula**: `sqrt(sum((a[i] - b[i])^2))`

### Face Detection Models
- **TinyFaceDetector**: Fast, lightweight face detection
- **FaceLandmark68Net**: 68-point facial landmark detection
- **FaceRecognitionNet**: 128D face descriptor extraction

### Storage
- In-memory static list (single user for POC)
- Cleared on registration (simplified demo)
- No database required

## 🎨 UI/UX Features

- Gradient background with card layout
- Real-time face detection overlay
- Visual feedback (green box + landmarks)
- Status messages for user guidance
- Modal dialogs for capture and results
- Smooth animations and transitions
- Responsive design

## ⚠️ Important Notes

- **POC Only**: Not production-ready
- **Single User**: Simplified to one registered user
- **No Persistence**: Data lost on restart
- **Browser Support**: Chrome/Edge recommended
- **HTTPS**: May be required for camera access
- **Lighting**: Good lighting improves accuracy

## 🔒 Security Considerations (For Production)

This POC does NOT include:
- User authentication/authorization
- Database persistence
- Password fallback
- Rate limiting
- Input validation (minimal)
- HTTPS enforcement
- Multi-user support
- Face liveness detection
- Encryption of face data

## 🐛 Troubleshooting

### Camera Not Working
- Check browser permissions
- Use HTTPS (required by some browsers)
- Try Chrome/Edge instead of Firefox/Safari

### Models Not Loading
- Check internet connection (models load from CDN)
- Check browser console for errors
- Clear browser cache

### Face Not Detected
- Ensure good lighting
- Face camera directly
- Remove glasses/masks if possible
- Move closer to camera

### Low Confidence Score
- Re-register with better lighting
- Ensure consistent camera angle
- Check camera quality

## 📁 Project Structure

```
FaceAuthPOC/
├── Controllers/
│   └── FaceAuthController.cs    # API endpoints
├── Models/
│   └── FaceUser.cs               # Data models
├── wwwroot/
│   ├── css/
│   │   └── style.css             # Styling
│   ├── js/
│   │   └── face-auth.js          # Frontend logic
│   └── index.html                # Main page
├── Program.cs                     # App configuration
└── FaceAuthPOC.csproj            # Project file
```

## 🎓 Learning Resources

- [face-api.js Documentation](https://github.com/justadudewhohacks/face-api.js)
- [ASP.NET Core Web API](https://docs.microsoft.com/en-us/aspnet/core/web-api/)
- [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)

## 📝 License

This is a proof-of-concept demo for educational purposes.

## 🎉 Demo Tips

1. **Good Lighting**: Demo in well-lit area
2. **Camera Position**: Eye-level, 2-3 feet away
3. **Registration**: Register with neutral expression
4. **Login Test**: Try different angles/expressions
5. **Show Confidence**: Highlight the confidence score feature

---

**Built with ❤️ for vibe-coding assignment**
