import { ObjectSchema } from 'joi';
import {
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}

  // TODO: check if value is changed after validating
  transform(value: any) {
    const result = this.schema.validate(value);
    if (result.error) {
      // TODO: check if we can use UnprocessableEntityException or BadRequestException
      throw new UnprocessableEntityException({
        message: 'Validation failed',
        details: result.error.message.replace(/"/g, ''),
      });
    }
    return result.value;
  }
}
