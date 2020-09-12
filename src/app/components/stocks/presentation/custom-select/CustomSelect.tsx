import React, { ChangeEvent } from "react";
import { IDropdown } from "../../data/interfaces/IDropdown.interface";
import "./CustomSelect.css";

import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export interface ISelectProps {
  label: string;
  options: IDropdown[];
  selectedOption: IDropdown;
  handleSelect: (event: ChangeEvent<{ name?: string; value: unknown }>, child: React.ReactNode) => void;
}

export default function CustomSelect(props: ISelectProps) {
  const classes = useStyles();

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-container__label-id" className="select-container__label">
          {props.label}
        </InputLabel>
        <Select
          labelId="select-container__label-id"
          className="select-container__select"
          value={props?.selectedOption?.id}
          onChange={props.handleSelect}
        >
          {props?.options?.map((option, key) => (
            <MenuItem className="select-container__select__option" key={key} value={option.id}>
              {option.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
