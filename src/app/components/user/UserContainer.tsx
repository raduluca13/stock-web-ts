import React, { Component } from "react";
import { connect } from "react-redux";
import IUser from "./state/data/IUser.interface";
import { getUsersStartActionCreator, setUserActionCreator } from "./state/actions/UserActionsCreator";
import IAppState from "app/store/IAppState.interface";

interface IUserContainerProps {
  getUsers: Function;
  setUser: Function;
  searchUsers: Function;
  user: IUser;
  users: IUser[];
  isFetching: boolean;
}

interface IUserContainerState {}

export const UserContainer: React.FunctionComponent<IUserContainerProps> = function ({
  getUsers,
  setUser,
  searchUsers,
  user,
  users,
  isFetching,
}) {
  // Workaround for Enyzme testing of useEffect, allows stubbing
  // See: https://blog.carbonfive.com/2019/08/05/shallow-testing-hooks-with-enzyme/
  React.useEffect(() => {
    getUsers();
  }, [getUsers]);

  return <h1>{user.name.first + user.name.last}</h1>;
};

// Make data available on props
const mapStateToProps = (store: IAppState) => {
  return {
    user: store.userState.user,
    users: store.userState.users,
    isFetching: store.userState.isFetching,
  };
};

// Make functions available on props
const mapDispatchToProps = (dispatch: Function) => {
  return {
    getUsers: () => dispatch(getUsersStartActionCreator()),
    setUser: (user: IUser) => dispatch(setUserActionCreator(user)),
    // searchUsers: (term: string) => dispatch(searchUsersActionCreator(term)),
  };
};

// Connect the app aware container to the store and reducers
// export default connect(mapStateToProps, mapDispatchToProps)(UserContainer);
