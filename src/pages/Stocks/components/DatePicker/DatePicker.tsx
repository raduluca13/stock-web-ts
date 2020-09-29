import React, { ChangeEvent, memo } from "react";
import { TextField } from "@material-ui/core";

export interface IDatePickerProps {
  label: string;
  // TODO - check if you need to separate between "value" and "defaultValue" - should not be the case
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const DatePicker = (props: IDatePickerProps) =>
  <TextField
    label={props.label}
    type="date"
    defaultValue={props.value}
    onChange={props.onChange}
    InputLabelProps={{
      shrink: true,
    }}
  />


export default memo(DatePicker)