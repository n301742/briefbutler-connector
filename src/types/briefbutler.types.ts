/**
 * Types for the BriefButler API service
 */

/**
 * Letter submission data for BriefButler
 */
export interface LetterSubmissionData {
  pdfPath: string;
  profileId: string;
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  recipientZip: string;
  recipientCountry: string;
  recipientState?: string;
  isExpress: boolean;
  isRegistered: boolean;
  isColorPrint: boolean;
  isDuplexPrint: boolean;
}

/**
 * Response from the BriefButler API
 */
export interface BriefButlerApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message: string;
}

/**
 * Letter status from the BriefButler API
 */
export interface LetterStatus {
  trackingId: string;
  status: string;
  timestamp: string;
  details?: {
    deliveryDate?: string;
    estimatedArrival?: string;
    currentLocation?: string;
    events?: LetterStatusEvent[];
  };
}

/**
 * Letter status event
 */
export interface LetterStatusEvent {
  date: string;
  description: string;
  location?: string;
}

/**
 * User profile from the BriefButler API
 */
export interface UserProfile {
  id: string;
  name: string;
  address: string;
  city?: string;
  zip?: string;
  country?: string;
  state?: string;
  defaultSender?: boolean;
}

/**
 * Spool service submission data for dual delivery
 */
export interface SpoolSubmissionData {
  pdfPath: string;           // Path to the PDF file to be sent
  recipientName: string;     // Name of the recipient
  recipientAddress: string;  // Street address of the recipient
  recipientCity: string;     // City of the recipient
  recipientZip: string;      // ZIP/Postal code of the recipient
  recipientCountry: string;  // Country of the recipient
  recipientState?: string;   // State/Province of the recipient (optional)
  recipientEmail?: string;   // Email address of the recipient (optional)
  recipientPhone?: string;   // Phone number of the recipient (optional)
  senderName: string;        // Name of the sender
  senderAddress: string;     // Street address of the sender
  senderCity: string;        // City of the sender
  senderZip: string;         // ZIP/Postal code of the sender
  senderCountry: string;     // Country of the sender
  senderState?: string;      // State/Province of the sender (optional)
  reference?: string;        // Reference identifier for the delivery (optional)
  isColorPrint?: boolean;    // Whether to print in color (optional, default: false)
  isDuplexPrint?: boolean;   // Whether to print duplex/double-sided (optional, default: true)
  priority?: string;         // Priority of the delivery: 'normal', 'priority', etc. (optional)
  deliveryProfile?: string;  // Delivery profile to use (optional, default: "briefbutler-test")
}