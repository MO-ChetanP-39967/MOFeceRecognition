# 🚀 QUICK START - 30 SECONDS TO DEMO

## Run the App (Choose One Method)

### Method 1: Double-click
```
run.bat
```

### Method 2: Command Line
```bash
cd FaceAuthPOC
dotnet run
```

## Open Browser
Navigate to: **http://localhost:5000**

## Demo Flow (2 minutes)

### Step 1: Register (30 seconds)
1. Click **"Register with Face"**
2. Allow camera access
3. Wait for green box around your face
4. Click **"Capture & Process"**
5. ✓ Success message appears

### Step 2: Login (30 seconds)
1. Click **"Login with Face"**
2. Position your face
3. Click **"Capture & Process"**
4. ✓ Login successful with confidence score!

### Step 3: Test Failure (30 seconds)
1. Have someone else try to login
2. Or cover part of your face
3. ✗ "Face not recognized" message

## 🎯 Demo Talking Points

1. **Real-time Detection**: Show the green box tracking your face
2. **Face Landmarks**: Point out the green dots on facial features
3. **Confidence Score**: Highlight the percentage match
4. **Security**: Explain Euclidean distance matching (0.6 threshold)
5. **Architecture**: Browser-based detection + .NET API for comparison

## ⚡ Pro Tips

- **Lighting**: Demo near a window or good light source
- **Distance**: Sit 2-3 feet from camera
- **Angle**: Face camera directly for best results
- **Expression**: Keep neutral expression for registration

## 🐛 Quick Fixes

**Camera not working?**
- Use Chrome or Edge browser
- Check camera permissions in browser settings
- Try HTTPS: https://localhost:5001

**Face not detected?**
- Improve lighting
- Move closer to camera
- Remove glasses temporarily

**Models loading slow?**
- Wait 5-10 seconds on first load
- Models download from CDN (one-time)

## 📊 What's Happening Behind the Scenes

1. **face-api.js** extracts 128 numbers from your face
2. These numbers are your unique "face fingerprint"
3. Backend stores this fingerprint
4. On login, new fingerprint is compared to stored one
5. If distance < 0.6 → Match! ✓
6. If distance > 0.6 → No match ✗

## 🎓 Technical Stack

- **Frontend**: face-api.js (TensorFlow.js based)
- **Backend**: ASP.NET Core 6.0 Web API
- **Algorithm**: Euclidean distance on 128D embeddings
- **Storage**: In-memory (POC only)

---

**Total Demo Time: 2 minutes**
**Setup Time: 30 seconds**
**Wow Factor: 💯**
