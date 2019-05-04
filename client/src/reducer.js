export default function reducer(state, action) {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        currentUser: action.payload
      };
    case 'LOGGED_IN':
      return {
        ...state,
        isAuthenticated: action.payload
      };
    case 'SIGNOUT_USER':
      return {
        ...state,
        isAuthenticated: false,
        currentUser: null
      };
    case 'CREATE_PIN':
      const newPin = action.payload;
      const prevPins = state.pins.filter(pin => pin._id !== newPin._id);
      return {
        ...state,
        pins: [...prevPins, newPin]
      };
    case 'DELETE_PIN':
      const deletedPin = action.payload;
      const filtered = state.pins.filter(pin => pin._id !== deletedPin._id);
      return {
        ...state,
        pins: filtered,
        currentPin: null
      };
    case 'SET_PIN':
      return {
        ...state,
        currentPin: action.payoad,
        draft: null
      };
    case 'CREATE_DRAFT':
      return {
        ...state,
        currentPin: null,
        draft: {
          longitude: 0,
          latitude: 0
        }
      };
    case 'UPDATE_DRAFT_LOCATION':
      return {
        ...state,
        draft: action.payload
      };
    case 'DELETE_DRAFT':
      return {
        ...state,
        draft: null
      };
    case 'GET_PINS':
      return {
        ...state,
        pins: action.payload
      };
    default:
      return state;
  }
}
