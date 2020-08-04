import React from "react";

interface IFormProps {
  text: string;
  age?: number;
}

interface IFormState {
  name: string;
  email: string;
}

export default class Form extends React.Component<IFormProps, IFormState> {
  state: IFormState = {
    name: "",
    email: "",
  };

  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value }: any = event.target;
    this.setState({
      name: value,
    });
  };

  public render() {
    const { text } = this.props;
    const { name } = this.state;

    return (
      <div>
        <input name="control" value={name} onChange={this.handleChange}></input>
      </div>
    );
  }
}
