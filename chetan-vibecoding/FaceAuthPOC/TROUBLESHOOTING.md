# 🔧 TROUBLESHOOTING GUIDE

## Common Issues & Solutions

### 1. Camera Access Issues

#### Problem: "Camera access denied"
**Symptoms:**
- Modal opens but video is black
- Browser shows camera blocked icon
- Console error: "NotAllowedError"

**Solutions:**
```
✓ Click the camera icon in browser address bar
✓ Select "Always allow" for camera access
✓ Refresh the page
✓ Try HTTPS instead: https://localhost:5001
✓ Check Windows camera privacy settings
✓ Ensure no other app is using the camera
```

#### Problem: "No camera found"
**Symptoms:**
- Error: "NotFoundError: Requested device not found"

**Solutions:**
```
✓ Check if webcam is connected
✓ Test camera in Windows Camera app
✓ Update webcam drivers
✓ Try a different USB port
✓ Restart browser
```

---

### 2. Face Detection Issues

#### Problem: "No face detected"
**Symptoms:**
- Video shows but no green box appears
- Capture button stays disabled
- Status: "Position your face in the frame"

**Solutions:**
```
✓ Improve lighting (face a window or lamp)
✓ Move closer to camera (2-3 feet optimal)
✓ Face camera directly (not at angle)
✓ Remove glasses temporarily
✓ Remove face mask
✓ Ensure face is fully visible (not cut off)
✓ Wait 2-3 seconds for detection to start
```

#### Problem: "Multiple faces detected"
**Symptoms:**
- Detection is unstable
- Green box jumps between faces

**Solutions:**
```
✓ Ensure only one person in frame
✓ Remove photos/posters with faces in background
✓ Adjust camera angle to exclude others
```

#### Problem: "Face detection is slow"
**Symptoms:**
- Green box updates slowly
- Laggy video feed

**Solutions:**
```
✓ Close other browser tabs
✓ Close other applications
✓ Use Chrome instead of Firefox/Safari
✓ Check CPU usage (should be <50%)
✓ Reduce browser zoom level to 100%
```

---

### 3. Model Loading Issues

#### Problem: "Stuck on 'Loading models...'"
**Symptoms:**
- Status never changes to "Ready"
- Buttons stay disabled
- Page seems frozen

**Solutions:**
```
✓ Check internet connection (models load from CDN)
✓ Wait 10-15 seconds (models are ~7MB total)
✓ Check browser console for errors (F12)
✓ Clear browser cache and refresh
✓ Try incognito/private mode
✓ Check if CDN is accessible:
  https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/
```

#### Problem: "404 errors in console"
**Symptoms:**
- Console shows "Failed to load resource: 404"
- Models not found

**Solutions:**
```
✓ Check internet connection
✓ Verify CDN URL is accessible
✓ Try alternative CDN (edit face-auth.js):
  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights/';
```

---

### 4. API / Backend Issues

#### Problem: "Network error" on register/login
**Symptoms:**
- Error modal: "Network error. Please try again."
- Console: "Failed to fetch"

**Solutions:**
```
✓ Ensure backend is running (dotnet run)
✓ Check terminal for errors
✓ Verify URL: http://localhost:5000
✓ Check CORS configuration in Program.cs
✓ Restart the backend server
✓ Check firewall settings
```

#### Problem: "Port already in use"
**Symptoms:**
- Error: "Address already in use: http://localhost:5000"
- Server won't start

**Solutions:**
```
✓ Kill existing process:
  Windows: netstat -ano | findstr :5000
           taskkill /PID <PID> /F
✓ Change port in launchSettings.json
✓ Restart computer (last resort)
```

#### Problem: "No registered users" error
**Symptoms:**
- Login fails with "Please register first"
- But you already registered

**Solutions:**
```
✓ Backend was restarted (in-memory storage cleared)
✓ Register again
✓ For persistence, implement database (see README)
```

---

### 5. Build / Compilation Issues

#### Problem: "dotnet command not found"
**Symptoms:**
- Terminal: "'dotnet' is not recognized"

**Solutions:**
```
✓ Install .NET 6.0 SDK:
  https://dotnet.microsoft.com/download/dotnet/6.0
✓ Restart terminal after installation
✓ Verify: dotnet --version
```

#### Problem: "Build failed with errors"
**Symptoms:**
- Compilation errors in terminal

**Solutions:**
```
✓ Run: dotnet restore
✓ Check .NET version: dotnet --version (should be 6.0+)
✓ Delete bin/ and obj/ folders
✓ Run: dotnet clean
✓ Run: dotnet build
```

---

### 6. Browser Compatibility Issues

#### Problem: "face-api.js not working"
**Symptoms:**
- Console: "faceapi is not defined"
- Models don't load

**Solutions:**
```
✓ Use Chrome or Edge (recommended)
✓ Update browser to latest version
✓ Disable browser extensions (ad blockers)
✓ Try incognito mode
✓ Check if JavaScript is enabled
```

#### Problem: "getUserMedia not supported"
**Symptoms:**
- Error: "getUserMedia is not supported"

**Solutions:**
```
✓ Use HTTPS: https://localhost:5001
✓ Update browser to latest version
✓ Use Chrome/Edge instead of IE
```

---

### 7. Performance Issues

#### Problem: "App is slow/laggy"
**Symptoms:**
- Video feed stutters
- Face detection is delayed
- High CPU usage

**Solutions:**
```
✓ Close other applications
✓ Close unnecessary browser tabs
✓ Use Chrome (best performance)
✓ Reduce video resolution (edit face-auth.js):
  video: { width: 320, height: 240 }
✓ Increase detection interval (edit face-auth.js):
  setInterval(async () => { ... }, 200); // 5fps instead of 10fps
```

---

### 8. Accuracy Issues

#### Problem: "Login fails even though it's me"
**Symptoms:**
- Confidence score is low (<60%)
- "Face not recognized" error

**Solutions:**
```
✓ Re-register with better lighting
✓ Use same camera angle as registration
✓ Remove glasses if you registered without them
✓ Ensure good lighting (face a light source)
✓ Move closer to camera
✓ Try multiple times (lighting affects accuracy)
✓ Lower threshold (edit FaceAuthController.cs):
  private const double MATCH_THRESHOLD = 0.5; // More lenient
```

#### Problem: "Wrong person can login"
**Symptoms:**
- Different person gets "Login successful"
- Confidence score is high for wrong person

**Solutions:**
```
✓ Increase threshold (edit FaceAuthController.cs):
  private const double MATCH_THRESHOLD = 0.7; // Stricter
✓ Re-register with better quality image
✓ Ensure good lighting during registration
✓ Note: Twins/similar faces may match (POC limitation)
```

---

### 9. UI / Display Issues

#### Problem: "Video is mirrored/flipped"
**Symptoms:**
- Video shows mirror image

**Solutions:**
```
✓ This is normal for webcams (like a mirror)
✓ To flip, add CSS (style.css):
  #video {
    transform: scaleX(-1);
  }
```

#### Problem: "Modal doesn't close"
**Symptoms:**
- Video modal stays open
- Can't click buttons

**Solutions:**
```
✓ Click Cancel button
✓ Press Escape key
✓ Refresh page
✓ Check browser console for JavaScript errors
```

#### Problem: "Buttons are disabled"
**Symptoms:**
- Can't click Register or Login

**Solutions:**
```
✓ Wait for models to load (3-5 seconds)
✓ Check status message
✓ Check browser console for errors
✓ Refresh page
```

---

### 10. HTTPS / Certificate Issues

#### Problem: "Your connection is not private"
**Symptoms:**
- Browser warning about certificate
- Can't access https://localhost:5001

**Solutions:**
```
✓ Click "Advanced" → "Proceed to localhost"
✓ Use HTTP instead: http://localhost:5000
✓ Trust development certificate:
  dotnet dev-certs https --trust
```

---

## Debugging Tips

### Enable Verbose Logging

**Browser Console (F12):**
```javascript
// Add to face-auth.js at top:
const DEBUG = true;

// Then add logging:
if (DEBUG) console.log('Face detected:', detection);
```

**Backend Logging:**
```csharp
// Add to FaceAuthController.cs:
Console.WriteLine($"Distance: {distance}, Threshold: {MATCH_THRESHOLD}");
```

### Check System Requirements

**Minimum Requirements:**
- .NET 6.0 SDK
- Chrome 90+ or Edge 90+
- 4GB RAM
- Webcam (720p or better)
- Internet connection (for CDN)

**Recommended:**
- .NET 6.0 or 7.0
- Chrome 120+ or Edge 120+
- 8GB RAM
- 1080p webcam
- Good lighting

### Test Components Individually

**Test Camera:**
```
1. Open Windows Camera app
2. Verify camera works
3. Check image quality
```

**Test Backend:**
```bash
# Test API directly
curl http://localhost:5000/api/faceauth/status
```

**Test Models:**
```javascript
// In browser console:
console.log(faceapi.nets.tinyFaceDetector.isLoaded);
```

---

## Getting Help

### Check Logs

**Browser Console (F12):**
- Look for red errors
- Check network tab for failed requests
- Look for 404, 500 errors

**Backend Terminal:**
- Look for exceptions
- Check for compilation errors
- Verify server is listening

### Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| NotAllowedError | Camera access denied | Allow camera in browser |
| NotFoundError | No camera found | Check camera connection |
| 404 Not Found | API endpoint missing | Check backend is running |
| 401 Unauthorized | Face not recognized | Re-register or adjust threshold |
| CORS error | Cross-origin blocked | Check CORS in Program.cs |
| faceapi is not defined | face-api.js not loaded | Check CDN connection |

### Still Having Issues?

1. **Read the README.md** - Full documentation
2. **Check QUICKSTART.md** - Step-by-step setup
3. **Review ARCHITECTURE.md** - Understand the system
4. **Check browser console** - Look for errors
5. **Check backend terminal** - Look for exceptions
6. **Try incognito mode** - Rule out extensions
7. **Restart everything** - Browser, backend, computer

---

## Known Limitations (POC)

These are expected behaviors, not bugs:

- ✓ Only one user can be registered at a time
- ✓ Data is lost when backend restarts
- ✓ Photos can fool the system (no liveness detection)
- ✓ Twins/similar faces may match
- ✓ Poor lighting reduces accuracy
- ✓ Glasses/masks reduce accuracy
- ✓ First load takes 3-5 seconds (model download)
- ✓ Requires internet connection (CDN models)

---

**Most issues are solved by:**
1. Good lighting
2. Facing camera directly
3. Using Chrome browser
4. Allowing camera access
5. Waiting for models to load
