import React from "react";

interface MyInfoProps {
  name: string;
  description: string;
  vacations: string[];
}

interface MyInfoState {}

export default class MyInfo extends React.Component<MyInfoProps, MyInfoState> {
  public render() {
    const { name, description, vacations } = this.props;

    return (
      <div>
        <h1>{name}</h1>
        <p>{description}</p>
        <ul>
          {vacations.map((vacation, index) => (
            <li key={index}>{vacation}</li>
          ))}
        </ul>
      </div>
    );
  }
}
