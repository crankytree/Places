import React, { useState, useEffect } from "react";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";

// const DUMMY_PLACES = [
//   {
//     id: 'p1',
//     title: 'Jublee Park',
//     description: 'urban park located in the city of Jamshedpur in India. ... It is a popular destination for all those who wish to have an outdoor picnic',
//     imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/e2/a5/9a/jubilee-park.jpg?w=1000&h=-1&s=1',
//     address: 'Jubilee Park, Sakchi, Jamshedpur, Jharkhand',
//     location: {
//       lat: 22.8123362,
//       lng: 86.1878528
//     },
//     creater: 'u1'
//   },
//   {
//     id: 'p2',
//     title: 'Jublee Park',
//     description: 'urban park located in the city of Jamshedpur in India. ... It is a popular destination for all those who wish to have an outdoor picnic',
//     imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/e2/a5/9a/jubilee-park.jpg?w=1000&h=-1&s=1',
//     address: 'Jubilee Park, Sakchi, Jamshedpur, Jharkhand',
//     location: {
//       lat: 22.8123362,
//       lng: 86.1878528
//     },
//     creater: 'u2'
//   },
// ]

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();

  const userId = useParams().userid;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {
        console.log(err);
      }
      
      
    }
    fetchUsers();
  }, [sendRequest, userId]);

  // const loadedPlaces = DUMMY_PLACES.filter((place) => place.creater === userId);

  const placeDeleteHandler = (deletedPlaceId) => {
    setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId));
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />}
    </React.Fragment>
  );
};
export default UserPlaces;
