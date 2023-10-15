import React, { useState, useEffect } from "react";
import axios from "axios";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import MapComponent from "../MapComponent/MapComponent";

function AddressAutocomplete() {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleAddressChange = (e) => {
    const { value } = e.target;
    setAddress(value);

    // Запрос к API DaData.ru для получения подсказок по адресу
    axios
      .post(
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
        {
          query: value,
          count: 5,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Token 4f78ef3fe06b3ce5d2a437cfc7df8792df198e27", // Замените на ваш API-ключ DaData
          },
        }
      )
      .then((response) => {
        setSuggestions(response.data.suggestions);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSuggestionSelect = (selectedSuggestion) => {
    setAddress(selectedSuggestion.value);
    setSelectedAddress([
      +selectedSuggestion.data.geo_lat,
      +selectedSuggestion.data.geo_lon,
    ]);
    console.log([
      +selectedSuggestion.data.geo_lat,
      +selectedSuggestion.data.geo_lon,
    ]);
    setSuggestions([]);
  };

  const handleMapClick = (e) => {
    const coordinates = e.get("coords");
    setSelectedAddress(coordinates.join(","));
    setAddress(coordinates.join(","));
  };

  const [value, setValue] = useState(1);

  const handleIncrement = () => {
    setValue((prevValue) => (prevValue < 15 ? prevValue + 1 : prevValue));
  };

  const handleDecrement = () => {
    setValue((prevValue) => (prevValue > 1 ? prevValue - 1 : prevValue));
  };

  const handleChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    // if (!isNaN(newValue) && newValue > 0 && newValue <= 15) {
    //   setValue(newValue);
    // }

    if(newValue > 15){
      setValue(15);
    } else if (newValue < 1){
      setValue(1);
    } else {
      setValue(newValue);
    }
  };



  return (
    <div className="map_component">
      <div className="map_body">
        <div className="inputs">
          <h3>Введите данные.</h3>
          <p>Необходимо заполните все указанные  поля!</p>
          <div className="map_address">
            {/* <label>Почта:</label> */}
            <input
              type="text"
              placeholder="Имя..."
              value={''}
              onChange={handleAddressChange}
            />
          </div>
          <div className="map_address">
            {/* <label>Адрес:</label> */}
            <input
              type="text"
              placeholder="Адрес..."
              value={address}
              onChange={handleAddressChange}
            />
            <ul>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.value}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  {suggestion.value}
                </li>
              ))}
            </ul>
          </div>
          <div className="map_address">
            {/* <label>Почта:</label> */}
            <input
              type="text"
              placeholder="Почта..."
              value={''}
              onChange={handleAddressChange}
            />
          </div>
          <div className="number-input">
            <button onClick={handleDecrement}>-</button>
            <input
              type="text"
              value={value}
              onChange={handleChange}
              placeholder="0"
            />
            <button onClick={handleIncrement}>+</button>
          </div>
          <button onClick={() => alert(`Выбранный адрес: ${address}`)}>Оформить</button>
        </div>
        <MapComponent
          selectedAddress={selectedAddress}
          handleMapClick={handleMapClick}
        />
      </div>
      {/* {selectedAddress && (
        <button >
          Продолжить
        </button>
      )} */}
    </div>
  );
}

export default AddressAutocomplete;
