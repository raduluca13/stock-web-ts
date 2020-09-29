import React, { memo } from "react";
import "./Header.css"; // Tell webpack that Button.js uses these styles

const Header = () => <header className="header">Stocks Web TS</header>


export default memo(Header);