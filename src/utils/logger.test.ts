import { logger, LogLevel } from './logger';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  
  beforeEach(() => {
    // Mock console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Reset environment
    delete process.env.LOG_LEVEL;
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('log levels', () => {
    it('should log all levels when LOG_LEVEL is DEBUG', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      
      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    it('should not log debug when LOG_LEVEL is INFO', () => {
      process.env.LOG_LEVEL = 'INFO';
      
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    it('should only log warnings and errors when LOG_LEVEL is WARN', () => {
      process.env.LOG_LEVEL = 'WARN';
      
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    it('should only log errors when LOG_LEVEL is ERROR', () => {
      process.env.LOG_LEVEL = 'ERROR';
      
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    it('should default to INFO level when LOG_LEVEL is not set', () => {
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    it('should default to INFO level when LOG_LEVEL is invalid', () => {
      process.env.LOG_LEVEL = 'INVALID_LEVEL';
      
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
  
  describe('formatting', () => {
    it('should format log messages with timestamp and level', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      
      logger.debug('Test message');
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\] \[DEBUG\] Test message/)
      );
    });
    
    it('should handle objects in log messages by stringifying them', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      const testObject = { test: 'value', nested: { prop: 123 } };
      
      logger.debug('Object:', testObject);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(JSON.stringify(testObject))
      );
    });
    
    it('should handle multiple arguments', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      
      logger.debug('Message 1', 'Message 2', 123);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Message 1 Message 2 123')
      );
    });
  });
});