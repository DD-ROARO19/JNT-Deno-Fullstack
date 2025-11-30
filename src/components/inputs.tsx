import { StringType, NumberType, ArrayType, ObjectType } from "./InputTypes.tsx";

export const inputs = {
  string: StringType,
  number: NumberType,
  array: ArrayType,
  object: ObjectType,
  null: () => <span>Replace</span>,
  boolean: () => <span>Replace</span>,
};
