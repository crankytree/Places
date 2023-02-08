import React, { useEffect, useState , useContext } from "react";
import { useParams , useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth.context";

import "./PlaceForm.css";
import Card from "../../shared/components/UIElements/Card";

// const DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Jublee Park",
//     description:
//       "urban park located in the city of Jamshedpur in India. ... It is a popular destination for all those who wish to have an outdoor picnic",
//     imageUrl:
//       "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/e2/a5/9a/jubilee-park.jpg?w=1000&h=-1&s=1",
//     address: "Jubilee Park, Sakchi, Jamshedpur, Jharkhand",
//     location: {
//       lat: 22.8123362,
//       lng: 86.1878528,
//     },
//     creater: "u1",
//   },
//   {
//     id: "p2",
//     title: "Jublee Park",
//     description:
//       "urban park located in the city of Jamshedpur in India. ... It is a popular destination for all those who wish to have an outdoor picnic",
//     imageUrl:
//       "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/e2/a5/9a/jubilee-park.jpg?w=1000&h=-1&s=1",
//     address: "Jubilee Park, Sakchi, Jamshedpur, Jharkhand",
//     location: {
//       lat: 22.8123362,
//       lng: 86.1878528,
//     },
//     creater: "u2",
//   },
// ];

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const history = useHistory();
  const authCtx = useContext(AuthContext);

  // console.log(placeId);

  // const [isLoading, setIsLoading] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();

  // console.log(identifiedPlace);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  // const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setLoadedPlace(responseData.place);

        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlace();
  }, [sendRequest, setFormData, placeId]);

  // useEffect(() => {
  //   if (identifiedPlace) {
  //     setFormData(
  //       {
  //         title: {
  //           value: identifiedPlace.title,
  //           isValid: true,
  //         },
  //         description: {
  //           value: identifiedPlace.description,
  //           isValid: true,
  //         },
  //       },
  //       true
  //     );
  //   }

  //   setIsLoading(false);
  // }, [setFormData, identifiedPlace]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token
        }
      );
      history.push('/' + authCtx.userId + '/places');
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }
  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not Find !!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please Enter a valid Title."
            onInput={inputHandler}
            // initialValue={formState.inputs.title.value}
            // initialValid={formState.inputs.title.isValid}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please Enter a valid description (atleast 5 characters)."
            onInput={inputHandler}
            // initialValue={formState.inputs.description.value}
            // initialValid={formState.inputs.description.isValid}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
