'use client'

import React from 'react'
import { Control, useController } from 'react-hook-form'
import Image from 'next/image'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormFieldType } from './forms/patientForm'
import 'react-phone-number-input/style.css'
import PhoneInput from "react-phone-number-input"
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'

interface CustomProps {
    control: Control<any>,
    fieldType: FormFieldType,
    name: string,
    label?: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    minDate?: Date; 
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    renderSkeleton?: (field: any) => React.ReactNode,
}


const RenderField = ({field, props}: {field: any; props: CustomProps}) => {
  const today = new Date();
  const minTime = new Date(today.setHours(17, 0, 0, 0)); // 5:00 PM
  const maxTime = new Date(today.setHours(22, 0, 0, 0));
  const {fieldType, iconSrc, iconAlt, placeholder, showTimeSelect, dateFormat, renderSkeleton} = props;
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className='flex rounded-md border border-dark-500 bg-dark-400'>
            {iconSrc && (
              <Image
                src={iconSrc}
                alt={iconAlt || 'icon'}
                width={24}
                height={24}
                className='ml-2'
              />
            )}
            <FormControl>
              <Input
                placeholder={placeholder}
                {...field}
                className='shad-input border-0'
              />
            </FormControl>
        </div>
      )

      case FormFieldType.TEXTAREA:
        return (
          <FormControl>
              <Textarea
                placeholder={placeholder}
                {...field}
                className='shad-textArea'
                disabled={props.disabled}
              
              />
            </FormControl>
        )

    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry='BD'
            placeholder={placeholder}
            international
            withCountryCallingCode
            value={field.value as string | undefined}
            onChange={field.onChange}
            className='input-phone'
          />
        </FormControl>
      )
    case FormFieldType.DATE_PICKER:
      return (
        <div className='flex rounded-md border border-dark-500 bg-dark-400'>
          
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt='calender'
            className=' m-2'
          />
          
          <FormControl>
            <DatePicker 
            selected={field.value} 
            onChange={(date) => field.onChange(date)} 
            dateFormat={dateFormat ?? 'dd/MM/yyyy'} 
            showTimeSelect={showTimeSelect ?? false} 
            timeInputLabel='Time:' 
            minTime={minTime} 
            maxTime={maxTime} 
            timeIntervals={15} 
            minDate={props.minDate ?? new Date()}
            wrapperClassName='date-picker'/>
          </FormControl>
        </div>
      )

    case FormFieldType.SELECT:
      return(
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl >
              <SelectTrigger className='shad-select-trigger'>
                <SelectValue placeholder={placeholder}/>
              </SelectTrigger>
              
            </FormControl>
            <SelectContent className='shad-select-content'>
              {props.children}
            </SelectContent>
            
          </Select>
        </FormControl>
      )  

    case FormFieldType.SKELETON:
        return renderSkeleton ? renderSkeleton (field) : null
      
    case FormFieldType.CHECKBOX:
        return (
          <FormControl>
            <div className='flex items-center gap-4'>
              <Checkbox
                id={props.name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label htmlFor={props.name} className='checkbox-label'>
                  {props.label}

              </label>
            </div>
              
            </FormControl>
        )
      default:
        break;

  }
}

const CustomFormField = (props: CustomProps) => {
  const {control, fieldType, name, label} = props;
  return (
            <FormField
              control={control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  {fieldType !== FormFieldType.CHECKBOX && label && (
                    <FormLabel>{label}</FormLabel>
                  )}

                  <RenderField field={field} props={props}/>

                  <FormMessage className='shad-error'/>
                </FormItem>
              )}
            />
  )
}

export default CustomFormField