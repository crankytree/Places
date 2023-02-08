import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
import "./UserList.css";

const UserList = (props) => {
  if (props.items.length === 0) {
    return <Card>
      <h2 className="center">No items found</h2>
    </Card>;
  }

  return (
    <ul className="user-list">
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UserList;
