import React, { useContext, useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./PlaceItem.css";
import { AuthContext } from "../../shared/context/auth.context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const PlaceItem = (props) => {
  const [showMap, setShowMap] = useState();

  const authCtx = useContext(AuthContext);

  const [showConfirmHandler, setShowConfirmHandler] = useState(false);

  const {isLoading , error , sendRequest , clearError} = useHttpClient();

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteHandler = () => {
    setShowConfirmHandler(true);
  };
  const cancelDeleteHandler = () => {
    setShowConfirmHandler(false);
  };

  const confirmDeleteHandler = async() => {
    setShowConfirmHandler(false);
    try{
      await sendRequest(process.env.REACT_APP_BACKEND_URL + `/places/${props.id}` , 'DELETE' , null , {
        Authorization: "Bearer " + authCtx.token
      }) 
      props.onDelete(props.id)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={15} />
          {/* <h2>The Map!!</h2> */}
        </div>
      </Modal>
      <Modal
        show={showConfirmHandler}
        onCancel={cancelDeleteHandler}
        header="Are you sure ?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            
            <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
          </React.Fragment>
        }
      >
        Do you really want to delete this place ?
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay/>}
          <div className="place-item__image">
            <img src={process.env.REACT_APP_ASSET_URL + `/${props.image}`} alt="Place" />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {authCtx.userId === props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
            {authCtx.userId === props.creatorId && <Button danger onClick={showDeleteHandler}>DELETE</Button>}
            
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
