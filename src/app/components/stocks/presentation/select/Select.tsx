import React, { SyntheticEvent } from "react";
import { IDropdown } from "../../data/interfaces/IDropdown.interface";

export interface ISelectProps {
  label: string;
  options: IDropdown[];
  selectedOption: IDropdown;
  handleSelect: (event: SyntheticEvent<HTMLSelectElement, Event>) => void;
}

export default function Select(props: ISelectProps) {
  console.log(props);
  return (
    <form>
      <label>{props.label}</label>
      <select value={props?.selectedOption?.id} onChange={props.handleSelect}>
        {props?.options?.map((option, key) => (
          <option key={key} value={option.id}>
            {option.value}
          </option>
        ))}
      </select>
    </form>
  );
}

// old react component
// export class Select2 extends Component<ISelectProps, ISelectState> {
//   constructor(props: Readonly<ISelectProps>) {
//     super(props);
//     this.handleSelect = this.props.handleSelect.bind(this);
//   }

//   handleSelect: (event: SyntheticEvent<HTMLSelectElement, Event>) => void;

//   render() {
//     return (
//       <form>
//         <label>{this.props.label}</label>
//         <select value={this.props?.selectedOption?.id} onChange={this.props.handleSelect}>
//           {this.props?.options?.map((option, key) => (
//             <option key={key} value={option.id}>
//               {option.value}
//             </option>
//           ))}
//         </select>
//       </form>
//     );
//   }
// }
