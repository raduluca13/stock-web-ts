import React, { ChangeEvent, memo } from "react";
import Input from "@material-ui/core/Input";
import { FormControl, InputLabel, FormHelperText } from "@material-ui/core";

export interface ISearchInputProps {
  label: string;
  value: string;
  hasError: boolean;
  errorMessage: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = (props: ISearchInputProps) => {
  return (
    <div>
      <FormControl error={props.hasError}>
        <InputLabel id="search-input-container__label-id" className="search-input-container__label">
          {props.label}
        </InputLabel>

        <Input value={props.value} onChange={props.onChange} />
        {props.hasError && <FormHelperText>{props.errorMessage}</FormHelperText>}
      </FormControl>
    </div>
  );
}

export default memo(SearchInput)
