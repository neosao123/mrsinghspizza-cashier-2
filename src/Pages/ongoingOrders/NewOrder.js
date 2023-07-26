import React, { useContext, useEffect, useState } from "react";
import "../../css/ongoingOrder.css";
import Nav from "../../layout/Nav";
import SpecialMenu from "./SpecialMenu";
import CreateYourOwn from "../../components/order/CreateYourOwn";
import {
  allIngredientsApi,
  deleteCartItemApi,
  getCartListApi,
  orderPlaceApi,
  sidesApi,
  storeLocationApi,
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

const canadianPhoneNumberRegExp = /^\d{3}\d{3}\d{4}$/;

const validateSchema = Yup.object({
  phoneno: Yup.string()
    .required("Phone number is required")
    .matches(
      canadianPhoneNumberRegExp,
      "Invalid Canadian phone number format. Use (XXX) XXX-XXXX."
    ),
  customername: Yup.string().required("Customer Name is Required."),
  address: Yup.string().required("Address is Required"),
  stores: Yup.string().required("Store Location is Required."),
});

function NewOrder() {
  const [allIngredients, setAllIngredients] = useState();
  const [sidesData, setSidesData] = useState();
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [storesLocationData, setStoreLocationData] = useState();
  const [storesCode, setStoresCode] = useState();
  const [discount, setDiscount] = useState(0);
  const [taxPer, setTaxPer] = useState(0);
  const [cartListData, setCartListData] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [cartCode, setCartCode] = useState();
  const [cartLineCode, setCartLineCode] = useState();
  const globalCtx = useContext(GlobalContext);
  const [cartItemDetails, setCartItemDetails] = globalCtx.cartItem;

  const initialValues = {
    phoneno: "",
    category: "pickup",
    customername: "",
    address: "",
    stores: "",
  };

  const onSubmit = async (values) => {
    console.log("");
  };

  //API - Pizza All Ingredients
  const pizzaIngredients = async () => {
    await allIngredientsApi()
      .then((res) => {
        setAllIngredients(res.data.data);
      })
      .catch((err) => {
        console.log("Error From All Ingredient API: ", err);
      });
  };

  //API - Sides Ingredients
  const sidesIngredient = async () => {
    await sidesApi()
      .then((res) => {
        setSidesData(res.data.data);
      })
      .catch((err) => {
        console.log("Error From All Ingredient API: ", err);
      });
  };

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
  const deleteCartItem = async (e, cartLineCode) => {
    e.preventDefault();
    swal({
      title: "Are you sure you want to delete?",
      text: "You will not be able to recover this item!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        let cart = JSON.parse(localStorage.getItem("CartData"));
        let payload = {
          cartLineCode: cartLineCode,
          discountAmount: "0",
          taxPer: "0",
        };
        await deleteCartItemApi(payload)
          .then((res) => {
            toast.success("Product Deleted Successfully..");
            getCartList();
          })
          .catch((err) => {
            console.log("Error From Delete Cart Item API: ", err);
          });
      }
    });
  };

  // Edit Cart Item
  const handleEditCartItem = (e, cartLineCode, cartCode) => {
    e.preventDefault();
    setIsEdit(true);
    setCartCode(cartCode);
    setCartLineCode(cartLineCode);
    const filteredCart = cartListData?.cartItems?.filter(
      (cartItem) => cartItem.code === cartLineCode
    );
    setCartItemDetails(filteredCart[0]);
  };

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
        values.stores
      );
      resetForm();
      return false;
      const payload = {
        cartCode: localStorage.getItem("cartCode"),
        customerName: values.customername,
        mobileNumber: values.phoneno,
        address: values.address,
        deliveryType: "pickup",
        storeLocation: values.stores,
      };

      await orderPlaceApi(payload)
        .then((res) => {
          console.log(res);
          toast.success(res.data.message);
          localStorage.removeItem("customerCode");
          localStorage.setItem("cartCode", "");
          // setSubmitting(false);
          getCartList();
          // resetForm()

          console.log(
            "After : ",
            values.customername,
            values.phoneno,
            values.address,
            values.deliveryType,
            values.stores
          );
        })
        .catch((err) => {
          if (err.response.status === 400 || err.response.status === 500) {
            toast.error(err.response.data.message);
          }
          // setSubmitting(false);
        });
    },
  });

  const handleRadiobtn = (e) => {
    setDeliveryType(e.target.value);
  };

  useEffect(() => {
    pizzaIngredients();
    sidesIngredient();
    storeLocation();
    getCartList();
  }, []);

  return (
    <>
      <Nav />
      <div className="container-fluid">
        <form onSubmit={formik.handleSubmit}>
          <div className="row gx-4">
            {/* Section 1 */}
            <div className="col-lg-2">
              <label className="form-label mt-2 mb-1">
                Phone <small className="text-danger">*</small>{" "}
              </label>
              <IntlTelInput
                containerClassName="intl-tel-input"
                type="tel"
                name="phoneno"
                inputClassName="form-control"
                placeholder="(XXX) XXX-XXXX"
                value={formik.values.phoneno}
                onBlur={formik.handleBlur}
                defaultCountry="CA"
                onlyCountries={["CA"]}
                preferredCountries={["CA"]}
                onPhoneNumberChange={(
                  status,
                  value,
                  countryData,
                  number,
                  id
                ) => {
                  formik.setFieldValue("phoneno", value);
                }}
              />
              {formik.touched.phoneno && formik.errors.phoneno ? (
                <div className="text-danger">{formik.errors.phoneno}</div>
              ) : null}
              <div className="my-3 m-0 p-0 d-flex justify-content-between">
                <label className="radio d-flex align-items-center my-1 w-50">
                  <input
                    className="mx-2"
                    type="radio"
                    checked={formik.values.category === "pickup" ? true : false}
                    onChange={formik.handleChange}
                    name="category[]"
                    value="pickup"
                  />
                  Pickup
                </label>
                <label className="radio d-flex align-items-center my-1 mx-2 w-50">
                  <input
                    className="mx-2"
                    type="radio"
                    name="category"
                    checked={
                      formik.values.category === "delivery" ? true : false
                    }
                    onChange={formik.handleChange}
                    value="delivery"
                  />
                  Delivery
                </label>
              </div>
              <label className="form-label">
                Customer Name <small className="text-danger">*</small>
              </label>
              <input
                className="form-control"
                type="text"
                name="customername"
                id="customername"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.customername}
              />
              {formik.touched.customername && formik.errors.customername ? (
                <div className="text-danger my-1">
                  {formik.errors.customername}
                </div>
              ) : null}
              <label className="form-label mt-2 mb-1">
                Address <small className="text-danger">*</small>
              </label>
              <textarea
                className="form-control"
                rows="4"
                cols="50"
                name="address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
              />
              {formik.touched.address && formik.errors.address ? (
                <div className="text-danger my-1">{formik.errors.address}</div>
              ) : null}
              <label className="form-label mt-2 mb-1">Store Location</label>
              <select
                className="form-select"
                id="storesID"
                name="stores"
                defaultValue={formik.values.stores ?? "STR_1"}
                value={formik.values.stores ?? ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Choose Stores Location</option>
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
                <div className="text-danger my-1">{formik.errors.stores}</div>
              ) : null}
              <h6 className="my-3">Previous Order</h6>
              <div>
                <table className="table text-center border-none">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Order</th>
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
            <div className="col-lg-6 my-1 section2">
              {/* Tabs Headings */}
              <ul
                className="nav nav-tabs psTabsUl mt-2 d-flex justify-content-between mb-3"
                role="tablist"
              >
                <li className="nav-item">
                  <Link
                    className="nav-link active py-2 px-auto psTabs"
                    data-bs-toggle="tab"
                    to="#createByOwn"
                  >
                    Create Your Own
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link py-2 px-auto psTabs"
                    data-bs-toggle="tab"
                    to="#special"
                  >
                    Special
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link py-2 px-auto psTabs"
                    data-bs-toggle="tab"
                    to="#sidesMenu"
                  >
                    Sides
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link py-2 px-auto psTabs"
                    data-bs-toggle="tab"
                    to="#dipsMenu"
                  >
                    Dips
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link py-2 px-auto psTabs"
                    data-bs-toggle="tab"
                    to="#drinksMenu"
                  >
                    Drinks
                  </Link>
                </li>
              </ul>
              {/* Tab Content */}
              <div className="tab-content m-0 p-0 w-100">
                {/* Create Your Own */}
                <div
                  id="createByOwn"
                  className="container tab-pane active m-0 p-0"
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
                  />
                </div>

                {/* SpecialMenu */}
                <div id="special" className="container tab-pane m-0 p-0">
                  <SpecialMenu />
                </div>

                {/* All SIdes */}
                <div id="sidesMenu" className="container tab-pane m-0 p-0">
                  <SidesMenu
                    getCartList={getCartList}
                    discount={discount}
                    taxPer={taxPer}
                  />
                </div>

                {/* All Dips */}
                <div
                  id="dipsMenu"
                  className="container tab-pane m-0 p-0 topping-list"
                >
                  <DipsMenu
                    getCartList={getCartList}
                    discount={discount}
                    taxPer={taxPer}
                  />
                </div>

                {/* All Drinks */}
                <div id="drinksMenu" className="container tab-pane m-0 p-0">
                  <DrinksMenu
                    getCartList={getCartList}
                    discount={discount}
                    taxPer={taxPer}
                  />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="col-lg-4 my-1">
              <h6 className="text-center">Order</h6>
              {/* Add to Cart */}
              <div className="p-3 rounded mb-3 addToCartList">
                {cartListData?.cartItems?.map((data) => {
                  return (
                    <div>
                      <div className="d-flex justify-content-between">
                        <h6>{data.productName}</h6>
                        <span className="mx-0">${data.price}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div className="d-flex justify-content-left">
                          <h6>Size : </h6>
                          <span className="mx-1">
                            {data.productType === "side"
                              ? data.config.sidesSize
                              : data.pizzaSize}
                          </span>
                        </div>
                        <div className="d-flex justify-content-right mx-0 mb-1">
                          <h6 className="mx-2">Quantity : </h6>
                          <span className="">{data.quantity}</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn m-0 p-0"
                          onClick={(e) => deleteCartItem(e, data.code)}
                          type="button"
                        >
                          <i
                            className="fa fa-trash-o"
                            aria-hidden="true"
                            style={{ fontSize: "1.1rem", color: "#ff5555" }}
                          ></i>
                        </button>
                        <button type="button" className="btn m-0 p-0 mx-3">
                          <i
                            className="fa fa-pencil-square-o"
                            aria-hidden="true"
                            style={{ fontSize: "1.1rem", color: "#7a3ee7" }}
                            onClick={(e) =>
                              handleEditCartItem(
                                e,
                                data.code,
                                cartListData?.code
                              )
                            }
                          ></i>
                        </button>
                      </div>
                      <hr className="border border-2 my-2 divider"></hr>
                    </div>
                  );
                })}
              </div>
              {/* Order Submit */}
              <div className="my-1">
                <form>
                  {/* Price / Sub Total */}
                  <div className="d-flex flex-wrap my-2 justify-content-end align-items-center OrderAmount">
                    <label className="form-label w-25">Price</label>
                    <div className="input-group w-75">
                      <div className="input-group-prepend">
                        <span className="input-group-text inputGroupTxt">
                          $
                        </span>
                      </div>
                      <input
                        className="form-control w-25 text-end"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        readOnly
                        value={cartListData?.subTotal}
                      ></input>
                      <div className="input-group-append">
                        <span className="input-group-text inputGroupTxt">
                          CAD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="d-flex flex-wrap my-2 my-2 justify-content-end align-items-center">
                    <label className="form-label w-25">Discount</label>
                    <div className="input-group w-75">
                      <div className="input-group-prepend">
                        <span className="input-group-text inputGroupTxt">
                          $
                        </span>
                      </div>
                      <input
                        className="form-control w-25 text-end"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        defaultValue={0}
                        onChange={(e) => setDiscount(e.target.value)}
                      ></input>
                      <div className="input-group-append">
                        <span className="input-group-text inputGroupTxt">
                          CAD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tax Percentage */}
                  <div className="d-flex flex-wrap my-2 justify-content-end align-items-center">
                    <label className="form-label w-25">Tax</label>
                    <div className="input-group w-75">
                      <div className="input-group-prepend">
                        <span className="input-group-text inputGroupTxt">
                          %
                        </span>
                      </div>
                      <input
                        className="form-control w-25 text-end"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        defaultValue={0}
                        onChange={(e) => setTaxPer(e.target.value)}
                      ></input>
                      <div className="input-group-append">
                        <span className="input-group-text inputGroupTxt">
                          CAD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grand Total / Total Price */}
                  <div className="d-flex flex-wrap my-2 justify-content-end align-items-center">
                    <label className="form-label w-25">Total Price</label>
                    <div className="input-group w-75">
                      <div className="input-group-prepend">
                        <span className="input-group-text inputGroupTxt">
                          $
                        </span>
                      </div>
                      <input
                        className="form-control w-25 text-end"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={cartListData?.grandTotal}
                        readOnly
                      ></input>
                      <div className="input-group-append">
                        <span className="input-group-text inputGroupTxt">
                          CAD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Order */}
                  <div className="d-flex flex-row justify-content-end align-items-center">
                    <button
                      type="button"
                      onClick={formik.handleSubmit}
                      disabled={formik.isSubmitting}
                      className="submitOrderbtn btn btn-sm my-3 px-4 py-2"
                    >
                      {formik.isSubmitting ? "Please wait..." : "Submit Order"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}

export default NewOrder;
