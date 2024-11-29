import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsSolanaAddressConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    const solanaAddressPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return solanaAddressPattern.test(value);
  }

  defaultMessage() {
    return `Invalid Solana Address`;
  }
}

// Create Decorator for the constraint that was just created
export function IsSolanaAddress() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      validator: IsSolanaAddressConstraint,
    });
  };
}
