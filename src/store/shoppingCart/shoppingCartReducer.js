import {
  ADD_ITEM,
  LOAD_CART,
  REMOVE_ITEM,
  SET_CART_STATUS,
  SET_DELIVERY_METHOD,
  UPDATE_ITEM_QUANTITY
} from './shoppingCartActions';

const initialState = {
  shoppingCartId: null,
  status: 'PENDING',
  items: [],
  clientSecret: '',
  paymentIntentId: '',
  deliveryMethodId: ''
};

function shoppingCartReducer(state, action) {
  switch (action.type) {
    case LOAD_CART:
      return {
        ...state,
        shoppingCartId: action.payload.id,
        items: action.payload.items,
        deliveryMethodId: parseInt(action.payload.deliveryMethodId, 10),
        clientSecret: action.payload.clientSecret,
        paymentIntentId: action.payload.paymentIntentId
      };
    case SET_CART_STATUS:
      return { ...state, status: action.payload };
    case ADD_ITEM: {
      const currentItem = state.items.find((x) => x.id === action.payload.id);
      if (currentItem) {
        const newItem = {
          ...currentItem,
          quantity: currentItem.quantity + action.payload.quantity
        };

        const newItems = state.items.map((item) => {
          if (item.id === newItem.id) return newItem;
          return item;
        });

        return { ...state, items: newItems };
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    }

    case UPDATE_ITEM_QUANTITY: {
      const currentItem = state.items.find(
        (x) => x.id === action.payload.itemId
      );
      const newItem = {
        ...currentItem,
        quantity: action.payload.quantity
      };
      const newItems = state.items.map((item) => {
        if (item.id === newItem.id) return newItem;
        return item;
      });
      return { ...state, items: newItems };
    }
    case REMOVE_ITEM: {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload
      );

      const newItems = [...state.items];

      newItems.splice(itemIndex, 1);

      return { ...state, items: newItems };
    }
    case SET_DELIVERY_METHOD:
      return { ...state, deliveryMethodId: action.payload };
    default:
      return state;
  }
}

export { initialState, shoppingCartReducer };
