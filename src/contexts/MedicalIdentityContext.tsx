import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MedicalIdentity {
  id: string;
  name: string;
  bloodGroup: string;
  allergies: string;
  medications: string;
  emergencyContact: string;
  chronicConditions: string;
  pastSurgeries: string;
  recentIssues: string;
  age: string;
  gender: string;
  doctorHospital?: string;
  reports?: Array<{ name: string; type: string; content: string }>;
  image?: string; // Base64 or URL
  createdAt: string;
  vitals?: {
    heartRate: number;
    bloodPressure: string;
    oxygenLevel: number;
    temperature: number;
  };
}

interface MedicalIdentityContextType {
  identities: MedicalIdentity[];
  activeUser: MedicalIdentity | null;
  registerIdentity: (identity: Omit<MedicalIdentity, 'id' | 'createdAt'>) => void;
  findMatch: (imageData?: string) => MedicalIdentity | null;
  setActiveUser: (user: MedicalIdentity | null) => void;
}

const MedicalIdentityContext = createContext<MedicalIdentityContextType | undefined>(undefined);

export const MedicalIdentityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeUser, setActiveUser] = useState<MedicalIdentity | null>(null);
  const [identities, setIdentities] = useState<MedicalIdentity[]>(() => {
    const saved = localStorage.getItem('biovita_identities');
    if (saved) return JSON.parse(saved);
    
    // Default Mock Users
    return [
      {
        id: '1',
        name: 'John Doe',
        bloodGroup: 'O+',
        allergies: 'Penicillin, Peanuts',
        medications: 'Lisinopril 10mg',
        emergencyContact: 'Jane Doe (+1 555-0101)',
        chronicConditions: 'Hypertension',
        pastSurgeries: 'Appendectomy (2015)',
        recentIssues: 'None',
        age: '42',
        gender: 'Male',
        doctorHospital: 'Saint Jude Hospital',
        image: 'https://i.pravatar.cc/300?u=john',
        createdAt: new Date().toISOString(),
        vitals: {
          heartRate: 72,
          bloodPressure: '120/80',
          oxygenLevel: 98,
          temperature: 36.6
        }
      },
      {
        id: '2',
        name: 'Sarah Connor',
        bloodGroup: 'A-',
        allergies: 'Latex',
        medications: 'None',
        emergencyContact: 'John Connor (+1 555-0102)',
        chronicConditions: 'None',
        pastSurgeries: 'None',
        recentIssues: 'Mild Asthma',
        age: '28',
        gender: 'Female',
        image: 'https://i.pravatar.cc/300?u=sarah',
        createdAt: new Date().toISOString(),
        vitals: {
          heartRate: 68,
          bloodPressure: '115/75',
          oxygenLevel: 99,
          temperature: 36.4
        }
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('biovita_identities', JSON.stringify(identities));
  }, [identities]);

  const registerIdentity = (data: Omit<MedicalIdentity, 'id' | 'createdAt'>) => {
    const newIdentity: MedicalIdentity = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      vitals: {
        heartRate: 70 + Math.floor(Math.random() * 10),
        bloodPressure: '120/80',
        oxygenLevel: 97 + Math.floor(Math.random() * 3),
        temperature: 36.5 + (Math.random() * 0.5)
      }
    };
    setIdentities(prev => [...prev, newIdentity]);
    setActiveUser(newIdentity);
  };

  const findMatch = (imageData?: string): MedicalIdentity | null => {
    if (identities.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * identities.length);
    return identities[randomIndex];
  };

  return (
    <MedicalIdentityContext.Provider value={{ identities, activeUser, registerIdentity, findMatch, setActiveUser }}>
      {children}
    </MedicalIdentityContext.Provider>
  );
};

export const useMedicalIdentity = () => {
  const context = useContext(MedicalIdentityContext);
  if (context === undefined) {
    throw new Error('useMedicalIdentity must be used within a MedicalIdentityProvider');
  }
  return context;
};
