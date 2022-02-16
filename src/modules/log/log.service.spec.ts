import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';

describe('LogService', () => {
  let service: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogService],
    }).compile();

    service = module.get<LogService>(LogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log', () => {
    const mockArgs = ['mock', 123, true];

    jest.spyOn(console, 'log');

    expect(service.log(...mockArgs)).toBeUndefined();
    expect(console.log).toBeCalledWith(...mockArgs);
  });
});
