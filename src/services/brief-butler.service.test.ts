import axios from 'axios';
import fs from 'fs';
import { BriefButlerService } from './brief-butler.service';
import { SpoolSubmissionData } from '../types/briefbutler.types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock fs
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('BriefButlerService', () => {
  let service: BriefButlerService;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup fs mock defaults
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue('certificate-content');
    
    // Create service instance with test mode enabled
    process.env.BRIEFBUTLER_TEST_MODE = 'true';
    process.env.BRIEFBUTLER_API_URL = 'https://api.test.com';
    service = new BriefButlerService();
  });
  
  afterEach(() => {
    delete process.env.BRIEFBUTLER_TEST_MODE;
    delete process.env.BRIEFBUTLER_API_URL;
  });
  
  describe('constructor', () => {
    it('should initialize with default values when environment variables are not set', () => {
      delete process.env.BRIEFBUTLER_API_URL;
      delete process.env.BRIEFBUTLER_TEST_MODE;
      
      const defaultService = new BriefButlerService();
      expect(defaultService).toBeDefined();
    });
    
    it('should initialize with environment variables when set', () => {
      process.env.BRIEFBUTLER_API_URL = 'https://custom-api.com';
      process.env.BRIEFBUTLER_TEST_MODE = 'true';
      
      const customService = new BriefButlerService();
      expect(customService).toBeDefined();
    });
  });
  
  describe('submitSpool', () => {
    it('should return mock data when in test mode', async () => {
      const testData: SpoolSubmissionData = {
        senderName: 'Test Sender',
        senderStreet: 'Test Street 1',
        senderCity: 'Test City',
        senderZip: '12345',
        recipientName: 'Test Recipient',
        recipientStreet: 'Recipient Street 1',
        recipientCity: 'Recipient City',
        recipientZip: '54321',
        subject: 'Test Subject',
        document: 'base64-encoded-document',
      };
      
      const result = await service.submitSpool(testData);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('trackingId');
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });
    
    it('should call the API with correct parameters when not in test mode', async () => {
      // Set test mode to false
      process.env.BRIEFBUTLER_TEST_MODE = 'false';
      service = new BriefButlerService();
      
      // Mock successful API response
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: { trackingId: 'real-tracking-id' },
          message: 'Success',
        }
      });
      
      const testData: SpoolSubmissionData = {
        senderName: 'Test Sender',
        senderStreet: 'Test Street 1',
        senderCity: 'Test City',
        senderZip: '12345',
        recipientName: 'Test Recipient',
        recipientStreet: 'Recipient Street 1',
        recipientCity: 'Recipient City',
        recipientZip: '54321',
        subject: 'Test Subject',
        document: 'base64-encoded-document',
      };
      
      const result = await service.submitSpool(testData);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('trackingId');
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/spool/dualDelivery'),
        expect.any(Object),
        expect.any(Object)
      );
    });
    
    it('should handle API errors properly', async () => {
      // Set test mode to false
      process.env.BRIEFBUTLER_TEST_MODE = 'false';
      service = new BriefButlerService();
      
      // Mock API error
      mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));
      
      const testData: SpoolSubmissionData = {
        senderName: 'Test Sender',
        senderStreet: 'Test Street 1',
        senderCity: 'Test City',
        senderZip: '12345',
        recipientName: 'Test Recipient',
        recipientStreet: 'Recipient Street 1',
        recipientCity: 'Recipient City',
        recipientZip: '54321',
        subject: 'Test Subject',
        document: 'base64-encoded-document',
      };
      
      const result = await service.submitSpool(testData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('getSpoolStatus', () => {
    it('should return mock status when in test mode', async () => {
      const result = await service.getSpoolStatus('test-tracking-id');
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('status');
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });
    
    it('should call the API with correct parameters when not in test mode', async () => {
      // Set test mode to false
      process.env.BRIEFBUTLER_TEST_MODE = 'false';
      service = new BriefButlerService();
      
      // Mock successful API response
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: { 
            trackingId: 'real-tracking-id',
            status: 'DELIVERED',
            timestamp: new Date().toISOString(),
          },
          message: 'Success',
        }
      });
      
      const result = await service.getSpoolStatus('real-tracking-id');
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('status');
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/spool/status/real-tracking-id'),
        expect.any(Object)
      );
    });
    
    it('should handle API errors properly', async () => {
      // Set test mode to false
      process.env.BRIEFBUTLER_TEST_MODE = 'false';
      service = new BriefButlerService();
      
      // Mock API error
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
      
      const result = await service.getSpoolStatus('error-tracking-id');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
  });
});