const express = require("express");
const { db } = require("../firebase");

const router = express.Router();

// POST /api/patient/register
router.post("/register", async (req, res) => {
  console.log("-----------------------------------------");
  console.log("RECEIVING REGISTRATION DATA");
  console.log("Body Content:", JSON.stringify(req.body, null, 2));
  console.log("-----------------------------------------");

  try {
    if (!db) {
      throw new Error("Firestore instance is not available. Check server logs for initialization errors.");
    }

    // Store data in the "patients" collection
    const docRef = await db.collection("patients").add({
      ...req.body,
      createdAt: new Date().toISOString()
    });

    console.log(`✅ Success! Data saved to Firestore. Document ID: ${docRef.id}`);

    res.status(201).json({
      success: true,
      patientId: docRef.id,
      message: "Patient registered and stored in Firestore successfully"
    });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to save data to Firestore"
    });
  }
});

// GET /api/patient (Fetch all patients for matching)
router.get("/", async (req, res) => {
  try {
    if (!db) throw new Error("Firebase not initialized");
    const snapshot = await db.collection("patients").get();
    const patients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(patients);
  } catch (error) {
    console.error("Fetch All Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch patients" });
  }
});

// GET /api/patient/:id (Fetch specific patient by ID)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!db) throw new Error("Firebase not initialized");
    const doc = await db.collection("patients").doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error("Fetch Specific Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch patient data" });
  }
});

// POST /api/patient/match (AI Matching on Backend)
router.post("/match", async (req, res) => {
  const { descriptor } = req.body;
  
  if (!descriptor) {
    return res.status(400).json({ success: false, message: "No face descriptor provided" });
  }

  console.log("🔍 [Matching] Scanned Descriptor (first 5):", descriptor.slice(0, 5));

  try {
    if (!db) throw new Error("Firebase not initialized");

    const snapshot = await db.collection("patients").get();
    if (snapshot.empty) {
      console.warn("⚠️ [Matching] No patients found in database.");
      return res.status(404).json({ matchFound: false, message: "No patients registered" });
    }

    let bestMatch = null;
    let minDistance = 0.6; // Strict Threshold

    snapshot.docs.forEach(doc => {
      const patient = doc.data();
      if (!patient.faceDescriptor) return;

      // Handle both Array and Object/Map representations
      const storedDescriptor = Array.isArray(patient.faceDescriptor) 
        ? patient.faceDescriptor 
        : Object.values(patient.faceDescriptor);
      
      const scannedDescriptor = Array.isArray(descriptor)
        ? descriptor
        : Object.values(descriptor);

      // Simple Euclidean Distance
      let sum = 0;
      for (let i = 0; i < storedDescriptor.length; i++) {
        sum += Math.pow(storedDescriptor[i] - scannedDescriptor[i], 2);
      }
      const distance = Math.sqrt(sum);

      console.log(`📏 [Matching] Distance to ${patient.name}: ${distance.toFixed(4)}`);

      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = { ...patient, id: doc.id };
      }
    });

    if (bestMatch) {
      console.log(`🎯 [Matching] Match Found! Patient: ${bestMatch.name} (Distance: ${minDistance.toFixed(4)})`);
      
      // Send SMS notification to Emergency Contact
      if (bestMatch.emergencyContact) {
        try {
          const { sendSMS } = require("../services/twilioService");
          const alertMessage = `🚨 BioVita Alert: Patient identified via Biometrics.
Name: ${bestMatch.name}
Blood Group: ${bestMatch.bloodGroup}
Allergies: ${bestMatch.allergies}
Status: Identified at Emergency Station.
Please contact BioVita for details.`;
          sendSMS(bestMatch.emergencyContact, alertMessage);
        } catch (smsErr) {
          console.error("⚠️ [Matching] SMS Notification failed:", smsErr.message);
        }
      }

      res.json({ matchFound: true, patient: bestMatch });
    } else {
      console.log("🔍 [Matching] No match found within threshold.");
      res.json({ matchFound: false, message: "No identity match found" });
    }
  } catch (error) {
    console.error("Matching Error:", error);
    res.status(500).json({ success: false, message: "Internal server error during matching" });
  }
});

module.exports = router;
