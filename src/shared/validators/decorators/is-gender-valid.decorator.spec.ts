import { validate, ValidationError } from 'class-validator';
import { IsGenderValid } from './is-gender-valid.decorator';

class TestDto {
  @IsGenderValid({ message: 'Invalid gender specified' })
  gender: string;
}

describe('IsGenderValid', () => {
  it('should validate gender as male', async () => {
    const dto = new TestDto();
    dto.gender = 'male';

    const errors: ValidationError[] = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate gender as female', async () => {
    const dto = new TestDto();
    dto.gender = 'female';

    const errors: ValidationError[] = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should not validate other values', async () => {
    const dto = new TestDto();
    dto.gender = 'other';

    const errors: ValidationError[] = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toBeDefined();
    expect(errors[0].constraints.IsGenderValidConstraint).toBe(
      'Invalid gender specified',
    );
  });

  it('should provide default message', async () => {
    class TestDefaultMessageDto {
      @IsGenderValid()
      gender: string;
    }

    const dto = new TestDefaultMessageDto();
    dto.gender = 'other';

    const errors: ValidationError[] = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toBeDefined();
    expect(errors[0].constraints.IsGenderValidConstraint).toBe(
      'Gender must be either "male" or "female"',
    );
  });
});
