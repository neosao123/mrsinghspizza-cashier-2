import React, { useEffect } from "react";

export const SelectDropDownCrust = ({
  crustSelected,
  handleCrustChange,
  allIngredients,
}) => {
  useEffect(() => {}, [crustSelected]);
  return (
    <>
      <select
        className='form-select'
        id='crust'
        defaultValue={""}
        value={crustSelected?.crustCode}
        onChange={handleCrustChange}
        required
      >
        {/* <option value={""}>--- choose any one ---</option> */}
        {allIngredients?.crust?.map((crustData, index) => {
          return (
            <option
              selected={crustData.crustName === "Regular"}
              key={"crustDropDown" + index}
              value={crustData?.crustCode}
            >
              {crustData.crustName} - $ {crustData.price}
            </option>
          );
        })}
      </select>
    </>
  );
};

export const SelectDropDownCheese = ({
  cheeseSelected,
  handleCheeseChange,
  allIngredients,
}) => {
  return (
    <select
      className='form-select'
      id='crust'
      defaultValue={""}
      value={cheeseSelected?.cheeseCode}
      onChange={handleCheeseChange}
      required
    >
      {/* <option value={""}>--- choose any one ---</option> */}
      {allIngredients?.cheese?.map((item, index) => {
        return (
          <option
            selected={item.cheeseName === "Mozzarella"}
            key={"cheese" + index}
            value={item?.cheeseCode}
          >
            {item.cheeseName} - $ {item.price}
          </option>
        );
      })}
    </select>
  );
};

export const SelectDropDownSpecialBases = ({
  allIngredients,
  handleSpecialBasesChange,
  specialBasesSelected,
}) => {
  return (
    <select
      className='form-select'
      id='specialbase'
      onChange={handleSpecialBasesChange}
      defaultValue={""}
      value={specialBasesSelected?.specialbaseCode}
    >
      <option value={""}>--- choose any one ---</option>
      {allIngredients?.specialbases?.map((specialbasesData, index) => {
        return (
          <>
            <option
              key={specialbasesData.specialbaseCode + "specialbase" + index}
              data-price={specialbasesData.price}
              value={specialbasesData?.specialbaseCode}
            >
              {specialbasesData.specialbaseName} - ${specialbasesData.price}
            </option>
          </>
        );
      })}
    </select>
  );
};
export const SelectDropDownCook = ({
  allIngredients,
  handleCookChange,
  cookSelected,
}) => {
  return (
    <select
      className='form-select'
      id='cook'
      onChange={handleCookChange}
      defaultValue={""}
      value={cookSelected?.cookCode}
      required
    >
      {/* <option value={""}>--- choose any one ---</option> */}
      {allIngredients?.cook?.map((cook, index) => {
        return (
          <option
            key={cook.cook + "createyourown" + index}
            data-price={cook.price}
            value={cook?.cookCode}
          >
            {cook.cook} - ${cook.price}
          </option>
        );
      })}
    </select>
  );
};
export const SelectDropDownSause = ({
  allIngredients,
  handleSauseChange,
  sauseSelected,
}) => {
  return (
    <select
      className='form-select'
      id='sause'
      onChange={handleSauseChange}
      defaultValue={""}
      value={sauseSelected?.sauceCode}
      required
    >
      {/* <option value={""}>--- choose any one ---</option> */}
      {allIngredients?.sauce?.map((sauce, index) => {
        return (
          <>
            <option
              key={sauce.sauce + "createyourown" + index}
              data-price={sauce.price}
              value={sauce?.sauceCode}
            >
              {sauce.sauce} - ${sauce.price}
            </option>
          </>
        );
      })}
    </select>
  );
};
export const SelectDropDownSpicy = ({
  allIngredients,
  handleSpicyChange,
  spicySelected,
}) => {
  return (
    <select
      className='form-select'
      id='Spicy'
      onChange={handleSpicyChange}
      defaultValue={""}
      value={spicySelected?.spicyCode}
      required
    >
      {/* <option value={""}>--- choose any one ---</option> */}
      {allIngredients?.spices?.map((spices, index) => {
        return (
          <>
            <option
              key={spices.spicy + "createyourown" + index}
              data-price={spices.price}
              value={spices?.spicyCode}
            >
              {spices.spicy} - ${spices.price}
            </option>
          </>
        );
      })}
    </select>
  );
};
