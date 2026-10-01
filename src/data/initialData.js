import { v4 as uuidv4 } from 'uuid';

// Pre-generated IDs for referencing
const FORM_1_ID = uuidv4();
const FORM_2_ID = uuidv4();
const IMAGE_1_ID = uuidv4();
const IMAGE_2_ID = uuidv4();
const IMAGE_3_ID = uuidv4();
const IMAGE_4_ID = uuidv4();
const IMAGE_5_ID = uuidv4();
const IMAGE_6_ID = uuidv4();

export const initialForms = [
  {
    id: FORM_1_ID,
    name: 'General Enquiry',
    successMessage: 'Thank you for reaching out! Our team will get back to you soon.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      { id: uuidv4(), label: 'First Name', name: 'first_name', type: 'text', required: true, placeholder: 'Enter your first name', options: [], order: 0 },
      { id: uuidv4(), label: 'Last Name', name: 'last_name', type: 'text', required: true, placeholder: 'Enter your last name', options: [], order: 1 },
      { id: uuidv4(), label: 'Mobile Number', name: 'mobile', type: 'phone', required: true, placeholder: 'Enter your mobile number', options: [], order: 2 },
      { id: uuidv4(), label: 'Email', name: 'email', type: 'email', required: true, placeholder: 'Enter your email', options: [], order: 3 },
    ],
  },
  {
    id: FORM_2_ID,
    name: 'Property Enquiry',
    successMessage: 'Thank you, our team will contact you shortly.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      { id: uuidv4(), label: 'Full Name', name: 'full_name', type: 'text', required: true, placeholder: 'Enter your full name', options: [], order: 0 },
      { id: uuidv4(), label: 'Mobile Number', name: 'mobile', type: 'phone', required: true, placeholder: 'Enter your mobile number', options: [], order: 1 },
      { id: uuidv4(), label: 'Email', name: 'email', type: 'email', required: true, placeholder: 'Enter your email', options: [], order: 2 },
      { id: uuidv4(), label: 'Requirement', name: 'requirement', type: 'textarea', required: false, placeholder: 'Describe your requirement', options: [], order: 3 },
      { id: uuidv4(), label: 'Document Upload', name: 'document', type: 'file', required: false, placeholder: '', options: [], order: 4 },
    ],
  },
];

export const initialLinks = [
  { id: uuidv4(), name: 'General Enquiry', path: '/enquiry', formId: FORM_1_ID },
  { id: uuidv4(), name: 'Property Enquiry', path: '/property-enquiry', formId: FORM_2_ID },
];

export const initialImages = [
  { id: IMAGE_1_ID, name: 'Hero Image', url: '', alt: 'Hero banner image', slot: 'hero' },
  { id: IMAGE_2_ID, name: 'Project Main Image', url: '', alt: 'Project showcase image', slot: 'project' },
  { id: IMAGE_3_ID, name: 'Project Gallery', url: '', alt: 'Project gallery image', slot: 'gallery' },
  { id: IMAGE_4_ID, name: 'Amenities Image', url: '', alt: 'Amenities showcase', slot: 'amenities' },
  { id: IMAGE_5_ID, name: 'Location Image', url: '', alt: 'Location map or photo', slot: 'location' },
  { id: IMAGE_6_ID, name: 'Floor Plan', url: '', alt: 'Floor plan diagram', slot: 'floorplan' },
];

export const initialPopups = [
  { id: uuidv4(), path: '/property-enquiry', formId: FORM_2_ID, enabled: false, trigger: 'scroll', scrollPercentage: 60 },
];
