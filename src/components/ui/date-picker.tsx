"use client"

import * as React from "react"
import { format } from "date-fns"
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
    setDate(value)
  }, [value])

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (onChange) {
      onChange(selectedDate || new Date())
    }
  }

  return (
    <div className="mx-auto w-full">
      {label && <Label htmlFor="date-picker-simple">{label}</Label>}
      <Popover>
        <PopoverTrigger asChild className="bg-white!">
          <Button
            variant="outline"
            id="date-picker-simple"
            className="flex w-[250px]"
            disabled={disabled}
            data-error={error}
            data-required={required}
          >
            <div className="items-start self-start">
              {date ? format(date, "dd/MM/yyyy") : <span className="align-start">{placeholder}</span>}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
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
