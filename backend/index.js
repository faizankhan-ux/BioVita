require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const supabase = require('./supabase');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Multer Memory Storage (No local disk storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to upload file to Supabase Storage
const uploadToSupabase = async (bucket, file) => {
  const fileName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw error;

  // Get Public URL
  const { data: publicData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicData.publicUrl;
};

// 1. POST /patient/register
app.post('/api/patient/register', upload.fields([
  { name: 'faceImage', maxCount: 1 },
  { name: 'reports', maxCount: 10 }
]), async (req, res) => {
  try {
    const formData = req.body;
    const faceImageFile = req.files['faceImage'] ? req.files['faceImage'][0] : null;
    const reportFiles = req.files['reports'] || [];

    // Upload Face Image
    let faceImageUrl = null;
    if (faceImageFile) {
      faceImageUrl = await uploadToSupabase('faces', faceImageFile);
    }

    // Upload Reports
    const reports = [];
    for (const file of reportFiles) {
      const url = await uploadToSupabase('reports', file);
      reports.push({
        name: file.originalname,
        type: file.mimetype,
        url: url // frontend expects this for content
      });
    }

    // Insert Patient Record (Mapping CamelCase frontend fields to SnakeCase DB fields)
    const { data: patient, error } = await supabase
      .from('patients')
      .insert([
        {
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender,
          blood_group: formData.bloodGroup,
          allergies: formData.allergies,
          chronic_conditions: formData.chronicConditions,
          medications: formData.medications,
          past_surgeries: formData.pastSurgeries,
          recent_issues: formData.recentIssues,
          emergency_contact: formData.emergencyContact,
          doctor_hospital: formData.doctorHospital,
          face_image_url: faceImageUrl,
          reports: reports
        }
      ])
      .select()
      .single();

    if (error) throw error;

    console.log(`Patient Registered: ${patient.name} (${patient.id})`);
    res.status(201).json({ 
      success: true, 
      patientId: patient.id, 
      message: "Identity enrolled successfully" 
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

// 2. POST /patient/match
app.post('/api/patient/match', upload.single('faceImage'), async (req, res) => {
  try {
    // Fetch latest patient (Priority 1: Demo Logic)
    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !patient) {
      return res.status(404).json({ matchFound: false, message: "No patients found in system" });
    }

    console.log(`Match Found: ${patient.name}`);
    
    // Map SnakeCase DB fields back to CamelCase frontend fields
    const mappedPatient = {
      id: patient.id,
      name: patient.name,
      bloodGroup: patient.blood_group,
      allergies: patient.allergies,
      chronicConditions: patient.chronic_conditions,
      medications: patient.medications,
      pastSurgeries: patient.past_surgeries,
      recentIssues: patient.recent_issues,
      emergencyContact: patient.emergency_contact,
      age: patient.age,
      gender: patient.gender,
      doctorHospital: patient.doctor_hospital,
      image: patient.face_image_url,
      reports: (patient.reports || []).map(r => ({
        ...r,
        content: r.url // Mapping url to content for frontend 'a href'
      }))
    };

    res.json({ matchFound: true, patient: mappedPatient });
  } catch (error) {
    console.error("Matching Error:", error);
    res.status(500).json({ success: false, message: "Matching process failed" });
  }
});

// 3. GET /patient/:id
app.get('/api/patient/:id', async (req, res) => {
  try {
    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const mappedPatient = {
      id: patient.id,
      name: patient.name,
      bloodGroup: patient.blood_group,
      allergies: patient.allergies,
      chronicConditions: patient.chronic_conditions,
      medications: patient.medications,
      pastSurgeries: patient.past_surgeries,
      recentIssues: patient.recent_issues,
      emergencyContact: patient.emergency_contact,
      age: patient.age,
      gender: patient.gender,
      doctorHospital: patient.doctor_hospital,
      image: patient.face_image_url,
      reports: (patient.reports || []).map(r => ({
        ...r,
        content: r.url
      }))
    };

    res.json(mappedPatient);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch patient" });
  }
});

// 4. POST /alert
app.post('/api/alert', (req, res) => {
  const { patientId, location, type } = req.body;
  console.log(`EMERGENCY ALERT: [${type}] Patient ${patientId} at ${JSON.stringify(location)}`);
  res.json({ 
    status: "Alert Sent", 
    message: "Emergency services have been notified",
    nearbyHospitals: ["Central Emergency Center", "Saint Jude Medical"] 
  });
});

app.listen(PORT, () => {
  console.log(`BioVita Backend running at http://localhost:${PORT}`);
});
