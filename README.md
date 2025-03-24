# BriefButler Connector

A connector service for integrating with the BriefButler spool service API, which provides dual delivery capabilities for documents (electronic and physical).

## Features

- Certificate-based authentication with the BriefButler API
- Document submission to the spool service
- Status tracking of submitted documents
- Mock mode for testing without real API calls
- Configurable delivery profiles

## Setup

### Prerequisites

- Node.js 14+
- TypeScript
- BriefButler certificate files (converted to PEM format)

### Certificate Conversion

Convert your PKCS12 PFX certificate to PEM format using OpenSSL:

```bash
# Extract certificate
openssl pkcs12 -in BB_Test_2024.p12 -out cert.crt -nodes -nokeys -clcerts -legacy

# Extract key
openssl pkcs12 -in BB_Test_2024.p12 -out key.key -nocerts -nodes -legacy
```

Place these files in the `certificates/converted/` directory.

### Environment Configuration

Create a `.env` file with the following variables:

```
# BriefButler API
BRIEFBUTLER_API_URL="https://demodelivery.briefbutler.com"
BRIEFBUTLER_CERTIFICATE_PATH="certificates/converted/cert.crt"
BRIEFBUTLER_KEY_PATH="certificates/converted/key.key"
BRIEFBUTLER_TEST_MODE="false"
```

## Usage

```typescript
import { briefButlerService } from './services/brief-butler.service';

// Submit a document
const result = await briefButlerService.submitSpool({
  pdfPath: '/path/to/document.pdf',
  recipientName: 'John Doe',
  recipientAddress: 'Example Street 123',
  recipientCity: 'Vienna',
  recipientZip: '1010',
  recipientCountry: 'AT',
  recipientEmail: 'john.doe@example.com',
  senderName: 'Jane Smith',
  senderAddress: 'Sender Street 456',
  senderCity: 'Vienna',
  senderZip: '1020',
  senderCountry: 'AT',
  reference: 'REF-123',
  deliveryProfile: 'briefbutler-test' // Optional, defaults to 'briefbutler-test'
});

// Check status
if (result.success) {
  const status = await briefButlerService.getSpoolStatus(result.data.letterId);
  console.log('Status:', status.data);
}
```

## Mock Mode

For development and testing, enable mock mode:

```typescript
// In code
briefButlerService.enableMockMode();

// Or via environment variable
// BRIEFBUTLER_TEST_MODE="true"
```

## API Reference

See the [BriefButler API documentation](https://developers.briefbutler.com/docs/spool.html) for more details on the available endpoints and parameters.

## License

MIT