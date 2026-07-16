import { describe, it, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AppController } from '../src/app.controller';

describe('AppController', () => {
  it('should return health status', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const controller = moduleRef.get(AppController);
    const result = controller.getHealth();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('fables-flow-api');
    expect(result.timestamp).toBeDefined();
  });
});
