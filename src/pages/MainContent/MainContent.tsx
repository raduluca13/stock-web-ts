import MyInfo from "components/others/my-info";
import React, { Component } from "react";
import "./MainContent.css";

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
