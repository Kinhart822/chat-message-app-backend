import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationCustomPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const firstError = errors[0];
      if (firstError.constraints) {
        throw new BadRequestException(
          firstError.constraints[Object.keys(firstError.constraints)[0]],
        );
      } else if (firstError.children && firstError.children.length > 0) {
        this.findError(firstError.children);
      }
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  protected findError(currentNode: any) {
    if (!currentNode || currentNode.length === 0) return;

    const node = currentNode[0];

    if (node?.constraints) {
      throw new BadRequestException(
        node.constraints[Object.keys(node.constraints)[0]],
      );
    }

    if (node?.children) {
      this.findError(node.children);
    }
  }
}
