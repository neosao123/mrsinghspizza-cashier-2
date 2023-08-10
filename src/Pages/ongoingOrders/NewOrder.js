import React, { useContext, useEffect, useRef, useState } from "react";
import "../../css/ongoingOrder.css";
import Nav from "../../layout/Nav";
import SpecialMenu from "./SpecialMenu";
import CreateYourOwn from "../../components/order/CreateYourOwn";
import {
  deleteCartItemApi,
  getCartListApi,
  getSpecialDetailsApi,
  orderPlaceApi,
  storeLocationApi,
  deliveryExecutiveApi,
} from "../../API/ongoingOrder";
import SidesMenu from "./SidesMenu";
import DipsMenu from "./DipsMenu";
import DrinksMenu from "./DrinksMenu";
import $ from "jquery";
import swal from "sweetalert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalContext from "../../context/GlobalContext";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import { allIngredientsApi, sidesApi } from "./newOrder/newOrderApi";
import {
  pizzaIngredients,
  sidesIngredient,
} from "./newOrder/newOrderCustomApiHandler";
import Cart from "./cart";
import { useDispatch, useSelector } from "react-redux";
import { setDisplaySpecialForm } from "../../reducer/cartReducer";
import { getSpecialDetails } from "./specialMenu/specialMenuCustomApiHandler";

function NewOrder() {
  // const [show, setShow] = useState(false);
  const [allIngredients, setAllIngredients] = useState();
  const [sidesData, setSidesData] = useState();
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [storesLocationData, setStoreLocationData] = useState();
  const [storesCode, setStoresCode] = useState();
  const [discount, setDiscount] = useState(0);
  const [taxPer, setTaxPer] = useState(0);
  const [cartListData, setCartListData] = useState();
  const [deliverExectiveList, setDeliverExectiveList] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [cartCode, setCartCode] = useState();
  const [cartLineCode, setCartLineCode] = useState();
  const globalCtx = useContext(GlobalContext);
  const [cartItemDetails, setCartItemDetails] = globalCtx.cartItem;
  const [orderData, setOrderData] = useState();
  const canadianPhoneNumberRegExp = /^\d{3}\d{3}\d{4}$/;
  const createYourOwnRef = useRef(null);
  const specialTabRef = useRef(null);
  const dipsRef = useRef(null);
  const dispatch = useDispatch();
  const sidesRef = useRef(null);
  const drinksRef = useRef(null);
  const handleProductClick = (productType) => {
    console.log("productType", productType);
    switch (productType) {
      case "custom_pizza":
        createYourOwnRef.current.click();
        break;
      case "side":
        sidesRef.current.click();
        break;
      case "dips":
        dipsRef.current.click();
        break;
      case "drinks":
        drinksRef.current.click();
        break;
      case "Special_Pizza":
        specialTabRef.current.click();

        dispatch(setDisplaySpecialForm(true));
        // getSpecialDetails(
        //   { code: payloadEdit.code },
        //   getSpecialDetailsApi,
        //   setGetSpecialData
        // );

        break;
      default:
        break;
    }
  };

  let cartdata = useSelector((state) => state.cart.cart);
  let totalPrice = 0;

  console.log(cartdata, "cartdatacartdata");
  cartdata.forEach((item) => {
    totalPrice += Number(item.amount);
  });
  const discountedTotalPrice = totalPrice - discount;
  const taxAmount = (discountedTotalPrice * taxPer) / 100;
  const grandTotal = discountedTotalPrice + taxAmount;

  console.log(totalPrice, "cartdatacartdata");

  const initialValues = {
    phoneno: "",
    category: "pickup",
    customername: "",
    address: "",
    stores: "",
    zipcode: "",
    deliveryExecutive: "",
  };

  //API - Pizza All Ingredients
  //API - Sides Ingredients

  //API - Store Location
  const storeLocation = async () => {
    await storeLocationApi()
      .then((res) => {
        setStoreLocationData(res.data.data);
      })
      .catch((err) => {
        console.log("ERROR From Store Location API : ", err);
      });
  };
  //deliver executive
  useEffect(() => {
    if (storesLocationData !== undefined) {
      deliverExecutive(storesLocationData[0]?.code);
    }

    console.log(storesLocationData, "storesLocationData");
  }, [storesLocationData]);

  const deliverExecutive = async (payload) => {
    await deliveryExecutiveApi(payload).then((res) => {
      setDeliverExectiveList(res.data.data);
    });
  };

  // handle Stores Location --> Store Code
  const handleStores = (e) => {
    let storesCode = $("#storesID").find(":selected").attr("data-key");
    setStoresCode(storesCode);
  };

  //API - Get Cart List
  const getCartList = async () => {
    let cart = JSON.parse(localStorage.getItem("CartData"));
    let cashierCode = localStorage.getItem("cashierCode");
    if (cart !== null && cart !== undefined) {
      let cartCode = cart.cartCode;
      let payload = {
        cartCode: cartCode,
        cashierCode: cashierCode,
      };
      await getCartListApi(payload)
        .then((res) => {
          setCartListData(res.data.data);
        })
        .catch((err) => {
          console.log("Error From Get Cart List API: ", err);
        });
    }
  };

  //API - Delete Item
  // const deleteCartItem = async (e, cartLineCode) => {
  //   e.preventDefault();
  //   swal({
  //     title: "Are you sure you want to delete?",
  //     text: "You will not be able to recover this item!",
  //     icon: "warning",
  //     buttons: ["Cancel", "Delete"],
  //     dangerMode: true,
  //   }).then(async (willDelete) => {
  //     if (willDelete) {
  //       let cart = JSON.parse(localStorage.getItem("CartData"));
  //       let payload = {
  //         cartLineCode: cartLineCode,
  //         discountAmount: "0",
  //         taxPer: "0",
  //       };
  //       await deleteCartItemApi(payload)
  //         .then((res) => {
  //           toast.success("Product Deleted Successfully..");
  //           getCartList();
  //         })
  //         .catch((err) => {
  //           console.log("Error From Delete Cart Item API: ", err);
  //         });
  //     }
  //   });
  // };

  // Edit Cart Item
  // const handleEditCartItem = (e, cartLineCode, cartCode) => {
  //   e.preventDefault();
  //   setIsEdit(true);
  //   setCartCode(cartCode);
  //   setCartLineCode(cartLineCode);
  //   const filteredCart = cartListData?.cartItems?.filter(
  //     (cartItem) => cartItem.code === cartLineCode
  //   );
  //   setCartItemDetails(filteredCart[0]);
  // };
  const validateSchema = Yup.object({
    phoneno: Yup.string()
      .required("Phone number is required")
      .matches(
        canadianPhoneNumberRegExp,
        "Invalid Canadian phone number format. Use (XXX) XXX-XXXX."
      ),
    customername: Yup.string().required("Customer Name is Required."),
    address:
      deliveryType === "pickup"
        ? null
        : Yup.string().required("Address is Required"),
    zipcode:
      deliveryType === "pickup"
        ? null
        : Yup.string().required("zipcode is Required"),
    deliveryExecutive:
      deliveryType === "pickup"
        ? null
        : Yup.string().required("Delivery Executive is Required"),
    stores: Yup.string().required("Store Location is Required."),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validateOnBlur: true,
    validationSchema: validateSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(
        "Before : ",
        values.customername,
        values.phoneno,
        values.address,
        values.category,
        values.stores,
        values.deliveryExecutive
      );
      resetForm();
      return false;
      // const payload = {
      //   cartCode: localStorage.getItem("cartCode"),
      //   customerName: values.customername,
      //   mobileNumber: values.phoneno,
      //   address: values.address,
      //   deliveryType: "pickup",
      //   storeLocation: values.stores,
      // };
    },
  });

  const handleRadiobtn = (e) => {
    setDeliveryType(e.target.value);
  };
  useEffect(() => {}, [deliveryType]);

  const [payloadEdit, setPayloadEdit] = useState();
  useEffect(() => {
    pizzaIngredients(allIngredientsApi, setAllIngredients);
    sidesIngredient(sidesApi, setSidesData);
    storeLocation();
    getCartList();
  }, []);

  return (
    <>
      <Nav />
      <div className='container-fluid orderContainer'>
        <form onSubmit={formik.handleSubmit}>
          <div className='row gx-4 orderContainer'>
            {/* Section 1 */}
            <div className='col-lg-2'>
              <label className='form-label mt-2 mb-1'>
                Phone <small className='text-danger'>*</small>{" "}
              </label>
              <IntlTelInput
                containerClassName='intl-tel-input mt-2 w-100'
                type='tel'
                name='phoneno'
                inputClassName='form-control'
                // type='number'
                placeholder='(XXX) XXX-XXXX'
                value={formik.values.phoneno.replace(/\D/g, "")}
                onBlur={formik.handleBlur}
                defaultCountry='CA'
                onlyCountries={["CA"]}
                preferredCountries={["CA"]}
                onPhoneNumberChange={(
                  status,
                  value,
                  countryData,
                  number,
                  id
                ) => {
                  if (value.length <= 10) {
                    // e.target.value = formattedValue;
                    formik.setFieldValue("phoneno", value);
                  }
                }}
              />
              {formik.touched.phoneno && formik.errors.phoneno ? (
                <div className='text-danger'>{formik.errors.phoneno}</div>
              ) : null}
              <div className='my-3 m-0 p-0 d-flex justify-content-between'>
                <label className='radio d-flex align-items-center my-1 w-50'>
                  <input
                    className='mx-2'
                    type='radio'
                    checked={formik.values.category === "pickup" ? true : false}
                    onChange={(e) => {
                      formik.handleChange(e);
                      handleRadiobtn(e);
                    }}
                    name='category'
                    value='pickup'
                  />
                  Pickup
                </label>
                <label className='radio d-flex align-items-center my-1 mx-2 w-50'>
                  <input
                    className='mx-2'
                    type='radio'
                    name='category'
                    checked={
                      formik.values.category === "delivery" ? true : false
                    }
                    onChange={(e) => {
                      formik.handleChange(e);
                      handleRadiobtn(e);
                    }}
                    value='delivery'
                  />
                  Delivery
                </label>
              </div>
              <label className='form-label'>
                Customer Name <small className='text-danger'>*</small>
              </label>
              <input
                className='form-control'
                type='text'
                name='customername'
                id='customername'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.customername}
              />
              {formik.touched.customername && formik.errors.customername ? (
                <div className='text-danger my-1'>
                  {formik.errors.customername}
                </div>
              ) : null}
              <label className='form-label mt-2 mb-1'>
                Address <small className='text-danger'>*</small>
              </label>
              <textarea
                className='form-control'
                rows='4'
                cols='50'
                name='address'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
              />
              {formik.touched.address && formik.errors.address ? (
                <div className='text-danger my-1'>{formik.errors.address}</div>
              ) : null}
              <label className='form-label'>
                Zip Code <small className='text-danger'>*</small>
              </label>
              <input
                className='form-control'
                type='number'
                name='zipcode'
                id='zipcode'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.zipcode}
              />
              {formik.touched.zipcode && formik.errors.zipcode ? (
                <div className='text-danger my-1'>{formik.errors.zipcode}</div>
              ) : null}
              <label className='form-label mt-2 mb-1'>Store Location</label>
              <select
                className='form-select'
                id='storesID'
                name='stores'
                defaultValue={formik.values.stores ?? "STR_1"}
                value={formik.values.stores ?? ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value=''>Choose Stores Location</option>
                {storesLocationData?.map((stores) => {
                  return (
                    <option
                      key={stores.code}
                      data-key={stores.code}
                      value={stores.code}
                    >
                      {stores.storeLocation}
                    </option>
                  );
                })}
              </select>

              {formik.touched.stores && formik.errors.stores ? (
                <div className='text-danger my-1'>{formik.errors.stores}</div>
              ) : null}

              {/* delivery executive  */}
              <label className='form-label mt-2 mb-1'>Delivery Executive</label>
              <select
                className='form-select'
                id='storesID'
                name='deliveryExecutive'
                defaultValue={formik.values.deliveryExecutive ?? "STR_1"}
                value={formik.values.deliveryExecutive ?? ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value=''>Choose Delivery Executive</option>
                {deliverExectiveList?.map((person) => {
                  return (
                    <option
                      key={person.code}
                      data-key={person.code}
                      value={person.code}
                    >
                      {person.firstName} {person.lastName}
                    </option>
                  );
                })}
              </select>

              {formik.touched.deliveryExecutive &&
              formik.errors.deliveryExecutive ? (
                <div className='text-danger my-1'>
                  {formik.errors.deliveryExecutive}
                </div>
              ) : null}

              <h6 className='my-3'>Previous Order</h6>
              <div>
                <table className='table text-center border-none'>
                  <thead>
                    <tr>
                      <th scope='col'>Date</th>
                      <th scope='col'>Order</th>
                    </tr>
                  </thead>
                  {/* <tbody>
                  <tr>
                    <th scope="row">
                      <input type="checkbox" />
                    </th>
                    <td>10-01-2023</td>
                    <td>Large Pizza</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <input type="checkbox" />
                    </th>
                    <td>04-07-2023</td>
                    <td>Extra Large Pizza</td>
                  </tr>
                </tbody> */}
                </table>
              </div>
            </div>

            {/* Section 2 */}
            <div className='col-lg-6 my-1 sectionTwo'>
              {/* Tabs Headings */}
              <ul
                className='nav nav-tabs psTabsUl mt-2 d-flex justify-content-between mb-3'
                role='tablist'
              >
                <li className='nav-item'>
                  <Link
                    ref={createYourOwnRef}
                    className='nav-link active py-2 px-auto psTabs'
                    data-bs-toggle='tab'
                    to='#createByOwn'
                  >
                    Create Your Own
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    ref={specialTabRef}
                    className='nav-link py-2 px-auto psTabs'
                    data-bs-toggle='tab'
                    to='#special'
                  >
                    Special
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    ref={sidesRef}
                    className='nav-link py-2 px-auto psTabs'
                    data-bs-toggle='tab'
                    to='#sidesMenu'
                  >
                    Sides
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    ref={dipsRef}
                    className='nav-link py-2 px-auto psTabs'
                    data-bs-toggle='tab'
                    to='#dipsMenu'
                  >
                    Dips
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    ref={drinksRef}
                    className='nav-link py-2 px-auto psTabs'
                    data-bs-toggle='tab'
                    to='#drinksMenu'
                  >
                    Drinks
                  </Link>
                </li>
              </ul>
              {/* Tab Content */}
              <div className='tab-content m-0 p-0 w-100'>
                {/* Create Your Own */}
                <div
                  id='createByOwn'
                  className='container tab-pane active m-0 p-0 '
                >
                  <CreateYourOwn
                    allIngredients={allIngredients}
                    sidesData={sidesData}
                    discount={discount}
                    taxPer={taxPer}
                    getCartList={getCartList}
                    isEdit={isEdit}
                    cartListData={cartListData}
                    cartCode={cartCode}
                    cartLineCode={cartLineCode}
                    payloadEdit={payloadEdit}
                    setPayloadEdit={setPayloadEdit}
                    setAllIngredients={setAllIngredients}
                    setOrderData={setOrderData}
                  />
                </div>

                {/* SpecialMenu */}
                <div id='special' className='container tab-pane m-0 p-0'>
                  <SpecialMenu
                    payloadEdit={payloadEdit}
                    setPayloadEdit={setPayloadEdit}
                    specialTabRef={specialTabRef}
                  />
                </div>

                {/* All SIdes */}
                <div id='sidesMenu' className='container tab-pane m-0 p-0'>
                  <SidesMenu
                    getCartList={getCartList}
                    discount={discount}
                    taxPer={taxPer}
                    payloadEdit={payloadEdit}
                    setPayloadEdit={setPayloadEdit}
                  />
                </div>

                {/* All Dips */}
                <div
                  id='dipsMenu'
                  className='container tab-pane m-0 p-0 topping-list'
                >
                  <DipsMenu
                    getCartList={getCartList}
                    discount={discount}
                    taxPer={taxPer}
                    payloadEdit={payloadEdit}
                    setPayloadEdit={setPayloadEdit}
                  />
                </div>

                {/* All Drinks */}
                <div id='drinksMenu' className='container tab-pane m-0 p-0'>
                  <DrinksMenu
                    payloadEdit={payloadEdit}
                    setPayloadEdit={setPayloadEdit}
                    getCartList={getCartList}
                    discount={discount}
                    taxPer={taxPer}
                  />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className='col-lg-4 mt-1 '>
              <h6 className='text-center'>Order</h6>
              {/* Add to Cart */}
              <div className='d-flex flex-column cart'>
                <div className='p-3 rounded mb-3 overflow-auto'>
                  <Cart
                    // cartRef={cartRef}
                    onProductClick={handleProductClick}
                    payloadEdit={payloadEdit}
                    setPayloadEdit={setPayloadEdit}
                  />
                </div>
                {/* Order Submit */}
                <div className=''>
                  <form>
                    {/* Price / Sub Total */}
                    <div className='d-flex flex-wrap my-2 justify-content-end align-items-center OrderAmount'>
                      <label className='form-label w-25'>Price</label>
                      <div className='input-group w-75'>
                        <div className='input-group-prepend'>
                          <span className='input-group-text inputGroupTxt px-2'>
                            $
                          </span>
                        </div>
                        <input
                          className='form-control w-25 text-end'
                          type='number'
                          placeholder='0.00'
                          step='0.01'
                          readOnly
                          value={Number(totalPrice).toFixed(2)}
                        ></input>
                        <div className='input-group-append'>
                          <span className='input-group-text inputGroupTxt'>
                            CAD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Discount */}
                    <div className='d-flex flex-wrap my-2 my-2 justify-content-end align-items-center'>
                      <label className='form-label w-25'>Discount</label>
                      <div className='input-group w-75'>
                        <div className='input-group-prepend'>
                          <span className='input-group-text inputGroupTxt px-2'>
                            $
                          </span>
                        </div>
                        <input
                          className='form-control w-25 text-end'
                          type='number'
                          placeholder='0.00'
                          min='0'
                          step='1'
                          defaultValue={0}
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                        ></input>
                        <div className='input-group-append'>
                          <span className='input-group-text inputGroupTxt'>
                            CAD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tax Percentage */}
                    <div className='d-flex flex-wrap my-2 justify-content-end align-items-center'>
                      <label className='form-label w-25'>Tax</label>
                      <div className='input-group w-75'>
                        <div className='input-group-prepend'>
                          <span className='input-group-text inputGroupTxt px-2'>
                            %
                          </span>
                        </div>
                        <input
                          className='form-control w-25 text-end'
                          type='number'
                          placeholder='0.00'
                          min='0'
                          step='1'
                          defaultValue={0}
                          onChange={(e) => setTaxPer(e.target.value)}
                        ></input>
                        <div className='input-group-append'>
                          <span className='input-group-text inputGroupTxt'>
                            CAD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Grand Total / Total Price */}
                    <div className='d-flex flex-wrap my-2 justify-content-end align-items-center'>
                      <label className='form-label w-25'>Total Price</label>
                      <div className='input-group w-75'>
                        <div className='input-group-prepend'>
                          <span className='input-group-text inputGroupTxt px-2'>
                            $
                          </span>
                        </div>
                        <input
                          className='form-control w-25 text-end'
                          type='number'
                          placeholder='0.00'
                          min='0'
                          step='0.01'
                          value={Number(grandTotal).toFixed(2)}
                          readOnly
                        ></input>
                        <div className='input-group-append'>
                          <span className='input-group-text inputGroupTxt'>
                            CAD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Order */}
                    <div className='d-flex flex-row justify-content-end align-items-center'>
                      <button
                        type='button'
                        onClick={formik.handleSubmit}
                        disabled={formik.isSubmitting}
                        className='submitOrderbtn btn btn-sm my-3 px-4 py-2'
                      >
                        {formik.isSubmitting
                          ? "Please wait..."
                          : "Submit Order"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer position='top-center' />
    </>
  );
}

export default NewOrder;
