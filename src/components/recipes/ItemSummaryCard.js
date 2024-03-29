import React from 'react';
import { Button, Card } from 'react-bootstrap';
import ImageFadeIn from 'react-image-fade-in';
import { toast } from 'react-toastify';

import { ShoppingCartContext } from '../../context/ShoppingCartContext';
import { calculateTotal } from '../../helpers/pricesCalculator';
import { addItemToCart } from '../../store/shoppingCart/shoppingCartActions';

import styles from './ItemSummaryCard.module.scss';

function ItemSummaryCard({ item }) {
  const [quantity, setQuantity] = React.useState(1);
  const [price, setPrice] = React.useState(item.productPrice);
  const { dispatch } = React.useContext(ShoppingCartContext);

  function quantityInputHandler(e) {
    let inputQuantity = parseInt(e.target.value, 10);
    if (inputQuantity <= 0) {
      inputQuantity = 1;
    }
    if (inputQuantity > 15) {
      inputQuantity = 15;
    }
    setQuantity(inputQuantity);
  }

  React.useEffect(() => {
    const newPrice = calculateTotal(item.productPrice, quantity);
    setPrice(newPrice);
  }, [quantity, item.productPrice]);

  return (
    <>
      <Card className={`${styles.card} shadow`}>
        <ImageFadeIn src={item.pictureUrl} width="100%" alt="product" />

        <div className={styles.grid}>
          <div className={styles.productDetails}>
            <p className={styles.itemTitle}>
              {`${item.productName}  ${item.productWeight}`}
            </p>

            <input
              type="number"
              id={item.id}
              value={quantity}
              onChange={quantityInputHandler}
              className={`${styles.quantityInput}`}
            />
          </div>

          <Card.Body className={styles.body}>
            <p className={styles.price}>{`${price}€`}</p>

            <Button
              variant="outline-black"
              className={styles.uppercase}
              disabled={item.productStock === 0}
              onClick={() => {
                dispatch(
                  addItemToCart({
                    id: item.productId,
                    name: item.productName,
                    price: item.productPrice,
                    discount: item.discount,
                    weight: item.productWeight,
                    quantity,
                    pictureUrl: item.pictureUrl,
                    brand: item.productBrand,
                    category: item.productCategory,
                    subcategory: item.productSubcategory
                  })
                );
                toast.dark('Item added to cart');
              }}
            >
              Add
            </Button>
          </Card.Body>
        </div>
      </Card>
    </>
  );
}

export { ItemSummaryCard };
