import React, { ChangeEvent } from "react";
import Input from "@material-ui/core/Input";
import { FormControl, InputLabel } from "@material-ui/core";

export interface ISearchInputProps {
  label: string;
  //   value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput(props: ISearchInputProps) {
  return (
    <div>
      <FormControl>
        <InputLabel id="search-input-container__label-id" className="search-input-container__label">
          {props.label}
        </InputLabel>
        <Input
          // value={props.value}
          onChange={props.onChange}
        />
      </FormControl>
    </div>
  );
}
