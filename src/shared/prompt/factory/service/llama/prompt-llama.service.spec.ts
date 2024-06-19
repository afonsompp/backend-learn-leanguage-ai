import { PromptLlama3Service } from './prompt-llama3.service';

describe('PromptLlama3Service', () => {
  let service: PromptLlama3Service;

  beforeEach(() => {
    service = new PromptLlama3Service();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPrompt', () => {
    it('should create a prompt from the given contents', () => {
      expect;
      const contents: Content[] = [
        { type: 'user', text: 'Turn off the light.' },
      ];

      const expectedPrompt =
        ' instruction Turn off the light. instruction Close the door. assistant';
      const prompt = service.createPrompt(contents);

      expect(prompt).toBe(expectedPrompt);
    });

    it('should handle an empty contents array', () => {
      const contents: Content[] = [];

      const expectedPrompt = ' assistant';
      const prompt = service.createPrompt(contents);

      expect(prompt).toBe(expectedPrompt);
    });
  });
});
