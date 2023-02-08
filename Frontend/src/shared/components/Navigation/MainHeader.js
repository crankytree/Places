import "./MainHeader.css";
import "./MainNavigation.css"

const MainHeader = (props) => {
  return <header className="main-header">{props.children}</header>;
};
export default MainHeader;
