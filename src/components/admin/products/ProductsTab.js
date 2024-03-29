import React from 'react';
import { Button, ButtonGroup, Form, Spinner } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { ToastContainer } from 'react-toastify';
import { BrandsContext } from '../../../context/BrandsContext';
import { MenuBarContext } from '../../../context/MenuBarContext';

import { ProductsContext } from '../../../context/ProductsContext';
import {
  closeBrandsModal,
  closeCategoriesModal,
  closeProductModal,
  showBrandsModal,
  showCategoriesModal,
  showProductModal
} from '../../../store/admin/productsTabActions';
import {
  initialState,
  productsTabReducer
} from '../../../store/admin/productsTabReducer';
import { initialProduct } from '../../../store/products/productReducer';
import { Pagination } from '../../pagination/Pagination';
import { BrandsModal } from './BrandsModal';
import { CategoriesModal } from './CategoriesModal';
import { ProductListItem } from './ProductListItem';
import { ProductModal } from './ProductModal';

import styles from './ProductsTab.module.scss';

function ProductsTab() {
  const [state, dispatch] = React.useReducer(productsTabReducer, initialState);
  const { products, apiParams, setApiParams } =
    React.useContext(ProductsContext);

  const { setBrandsSortValue } = React.useContext(BrandsContext);
  const { setProductCategoriesSort } = React.useContext(MenuBarContext);

  const [searchInput, setSearchInput] = React.useState('');

  const pageHandler = (pageIndex) => {
    setApiParams({ ...apiParams, pageIndex });
  };

  const searchHandler = (e) => {
    e.preventDefault();
    setApiParams({ ...apiParams, search: searchInput });
  };

  const showBrandsModalHandler = () => dispatch(showBrandsModal);
  const hideBrandsModalHandler = () => dispatch(closeBrandsModal);

  React.useEffect(() => setApiParams({ pageIndex: 1, search: '' }), []);

  return (
    <>
      <br />

      <ButtonGroup>
        <Button
          variant="outline-black"
          onClick={() => {
            dispatch(showProductModal);
            setBrandsSortValue('nameAsc');
            setProductCategoriesSort('nameAsc');
          }}
        >
          Add Product
        </Button>

        <Button
          variant="outline-black"
          onClick={() => {
            dispatch(showBrandsModal);
            setBrandsSortValue('latest');
          }}
        >
          Edit Brands
        </Button>

        <Button
          variant="outline-black"
          onClick={() => {
            dispatch(showCategoriesModal);
            setProductCategoriesSort('latest');
          }}
        >
          Edit Categories
        </Button>
      </ButtonGroup>

      <br />
      <br />

      <Form>
        <Form.Group>
          <Form.Control
            type="text"
            className="search-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onClick={() => setSearchInput('')}
          />

          <Button type="submit" variant="no-margin" onClick={searchHandler}>
            <Search />
          </Button>
        </Form.Group>
      </Form>

      {products.status === 'FETCHED' ? (
        <div className="flexbox-column">
          <Pagination
            pageSize={products.result.pageSize}
            totalProducts={products.result.count}
            pageNumberHandler={pageHandler}
            pageIndex={products.result.pageIndex}
          />

          {products.result.data.length === 0 && (
            <p>No results matched your search</p>
          )}

          <ul className={`${styles.productGrid} no-list-style`}>
            {products.result.data.map((product) => (
              <li key={product.id}>
                <ProductListItem product={product} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <br />
          <br />
          <br />
          <Spinner animation="border" />
        </>
      )}

      <ProductModal
        product={initialProduct}
        show={state.showProductModal}
        close={() => dispatch(closeProductModal)}
      />

      <CategoriesModal
        show={state.showCategoriesModal}
        close={() => dispatch(closeCategoriesModal)}
        dispatch={dispatch}
      />

      <BrandsModal
        visible={state.showBrandsModal}
        show={showBrandsModalHandler}
        close={hideBrandsModalHandler}
      />

      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export { ProductsTab };
