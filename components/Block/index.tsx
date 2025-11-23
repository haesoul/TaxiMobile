import React from 'react';
import { UseFormReturn } from 'react-hook-form';



import BigTruckServices from '../BigTruckServices';
import Button from '../Button';
import Card from '../Card/Card';
import Checkbox from '../Checkbox';
import ErrorBlock from '../ErrorBlock';
import HTML from '../HTML';

const mapBlockObject = (props: any) => props;
const fieldNameRequired = ['BigTruckServices'];

interface IProps {
  form: UseFormReturn<any>;
  values: {
    [x: string]: any;
  };
  type?: string;
  fieldName?: string;
  fieldValue?: any;
  [key: string]: any;
}

function Block({ form, values, type, fieldName, fieldValue, ...rawProps }: IProps) {
  if (type && fieldNameRequired.includes(type) && !fieldName) {

    return <ErrorBlock text="fieldName отсутствует" />;
  }

  const props = mapBlockObject(rawProps);

  switch (type) {
    case 'BigTruckServices':
      return (
        <BigTruckServices
          value={values[fieldName as string]}
          onChange={(v: any) => form.setValue(fieldName as string, v)}
        />
      );

    case 'Button':
      return <Button {...props} />;

    case 'Card':
      return (
        <Card
          {...props}
          active={values[fieldName as string] === fieldValue}
          onClick={() => form.setValue(fieldName as string, fieldValue)}
        />
      );

    case 'Checkbox':
      return (
        <Checkbox 
          {...props} 
          checked={!!values[fieldName as string]}
          onValueChange={(checked) => form.setValue(fieldName as string, checked)}
        />
      );

    default:
      return <HTML {...props} />;
  }
}

export default Block;