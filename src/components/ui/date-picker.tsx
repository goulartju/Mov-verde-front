"use client"

import * as React from "react"
import { format, startOfDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "./label"

export interface DatePickerProps {
  label?: string;
  value?: Date;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  onChange?: (date: Date) => void;
}


const DatePicker: React.FC<DatePickerProps> = ({
  value,
  label,
  placeholder = "dd/mm/aaaa",
  disabled = false,
  error,
  required = false,
  onChange }) => {

  const [date, setDate] = React.useState<Date | undefined>(value)

  React.useEffect(() => {
    if (value && value instanceof Date && !isNaN(value.getTime())) {
      setDate(startOfDay(value))
    } else {
      setDate(undefined)
    }
  }, [value])

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      const correctedDate = startOfDay(selectedDate)
      setDate(correctedDate)
      if (onChange) {
        onChange(correctedDate)
      }
    } else {
      setDate(undefined)
    }
  }

  return (
    <div className="mx-auto w-full">
      {label && <Label htmlFor="date-picker-simple">{label}</Label>}
      <Popover>
        <PopoverTrigger asChild className="bg-white! w-full">
          <Button
            variant="outline"
            id="date-picker-simple"
            className="flex w-[250px]"
            disabled={disabled}
            data-error={error}
            data-required={required}
          >
            <div className="items-start self-start">
              {date && !isNaN(date.getTime()) ? format(date, "dd/MM/yyyy") : <span className="align-start">{placeholder}</span>}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="!w-fit p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            defaultMonth={date}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePicker;
