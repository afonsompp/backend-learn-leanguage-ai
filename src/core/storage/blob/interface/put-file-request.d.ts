import { Readable } from 'stream';

interface PutFileRequest {
  key: string;
  body: string | Uint8Array | Buffer | Readable;
}
