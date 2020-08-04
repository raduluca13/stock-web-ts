import React, { Component } from "react";
import MyInfo from "../my-info";
import "./main-content.css";

interface IMainContentProps {}
interface IMainContentState {}

export default class MainContent extends Component<IMainContentProps, IMainContentState> {
  public render() {
    const styles = {
      // fontSize: 16;
    };

    return (
      <main className="main-container" style={styles}>
        {/* <Form text="teeext" /> */}
        <MyInfo name="Radu" description="nothing to say as always" vacations={["1", "2", "3"]} />
      </main>
    );
  }
}
