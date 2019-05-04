import React, { useState, useEffect, useContext } from 'react';
import ReactMapGl, { Marker, Popup } from 'react-map-gl';

import { withStyles } from '@material-ui/core/styles';
import { useClient } from '../../client';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import Blog from './Blog';
import PinIcon from './PinIcon';
import Context from '../../context';
import { DELETE_PIN_MUTATION } from '../../graphql/mutation';
import { GET_PINS_QUERY } from '../../graphql/queries';
import diffInMin from 'date-fns/difference_in_minutes';
import { format } from 'date-fns';

const initialViewport = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
};

const Map = ({ classes }) => {
  useEffect(() => {
    getPins();
  }, []);
  const [popup, setPopup] = useState(null);
  const client = useClient();
  const { state, dispatch } = useContext(Context);

  const [viewport, setViewport] = useState(initialViewport);

  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    getUserPosition();
  }, []);

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({
      type: 'GET_PINS',
      payload: getPins
    });
  };

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: 'CREATE_DRAFT' });
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: 'UPDATE_DRAFT_LOCATION',
      payload: { longitude, latitude }
    });
  };

  const highlightNewPin = pin => {
    return diffInMin(Date.now(), Number(pin.createdAt)) <= 30
      ? 'black'
      : 'purple';
  };

  const onSelectedPin = pin => {
    setPopup(pin);
    dispatch({
      type: 'SET_PIN',
      payload: pin
    });
  };

  const isAuthUser = () => state.currentUser._id === popup.author._id;

  const handleDeletePin = async pin => {
    const variables = { pinId: pin._id };
    const { deletePin } = await client.request(DELETE_PIN_MUTATION, variables);
    dispatch({
      type: 'DELETE_PIN',
      payload: deletePin
    });
    setPopup(null);
  };

  return (
    <div className={classes.root}>
      <ReactMapGl
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiaW5pZ2h0ZWxmIiwiYSI6ImNqdWRtMWM3ODB2aDA0ZHF5aGU1dTZidjkifQ.DrZulGHSR0xb_I3mAkpWmw"
        onViewportChange={viewport => setViewport(viewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        {/* Pin for User's Current Position */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-20}
            offsetTop={-35}
          >
            <PinIcon size={40} color="green" />
          </Marker>
        )}

        {/* pin */}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-20}
            offsetTop={-35}
          >
            <PinIcon size={40} color="blue" />
          </Marker>
        )}
        {/* created pins */}
        {state.pins.map(pin => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-20}
            offsetTop={-35}
          >
            <PinIcon
              onClick={() => onSelectedPin(pin)}
              size={40}
              color={highlightNewPin(pin)}
            />
          </Marker>
        ))}

        {/* Popup */}
        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
            style={{ width: '100px' }}
          >
            <img
              className={classes.popupImage}
              src={popup.image}
              alt={popup.title}
            />
            <div className={classes.popupTab}>
              <Typography>{popup.title}</Typography>
              <Typography>{popup.content}</Typography>
              <Typography>
                {format(Number(popup.createdAt), 'MMM Do, YYYY')}
              </Typography>
              {isAuthUser() && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGl>

      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: 'flex'
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em'
  },
  deleteIcon: {
    color: 'red'
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover'
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
};

export default withStyles(styles)(Map);
