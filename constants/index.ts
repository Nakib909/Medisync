export const GenderOptions = ["male", "female", "other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insuranceProviderNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "Sulaiman Ahmed",
    education: "MBBS, FCPS (Medicine), MD (Cardiology)",
    specialization: "Cardiologist",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Akter Sharmin",
    education: "MBBS, DGO, MS (Gynaecology & Obstetrics)",
    specialization: "Gynaecologist & Obstetrician",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "Iqbal Ahmed",
    education: "MBBS, MS (Orthopaedics)",
    specialization: "Orthopaedic Surgeon",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Amin",
    education: "MBBS, MD (Dermatology)",
    specialization: "Dermatologist",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jahan Ahmed",
    education: "MBBS, MD (Neurology)",
    specialization: "Neurologist",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Ali Iqbal",
    education: "MBBS, FCPS (Paediatrics)",
    specialization: "Child Specialist (Paediatrician)",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Akter",
    education: "MBBS, MS (ENT)",
    specialization: "ENT Specialist",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Chowdhury",
    education: "MBBS, FCPS (Ophthalmology)",
    specialization: "Eye Specialist (Ophthalmologist)",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
    education: "MBBS, MD (Psychiatry)",
    specialization: "Psychiatrist",
  },
];


export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};