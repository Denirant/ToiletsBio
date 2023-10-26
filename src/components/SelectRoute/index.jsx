import React, { useState, useEffect } from "react";
import axios from "axios";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import MapComponent from "../MapComponent/MapComponent";

import emailjs from "@emailjs/browser";

import * as turf from "@turf/turf";

import configPrice from "../../config/data.json";
import KADCoords from "../../utils/KAD";

function AddressAutocomplete({ outerdata = null }) {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [prevData, setPrevData] = useState(null);
  const [price, setPrice] = useState(null);
  const [value, setValue] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');

  const [isOrderComplete, setIsOrderComplete] = useState(false);

  useEffect(() => {
    // В этом эффекте следим за изменениями outerdata?.address и обновляем address
    if (outerdata?.address && outerdata?.address !== address) {
      setAddress(outerdata?.address);
    }
  }, [outerdata?.address]);

  useEffect(() => {
    // В этом эффекте следим за изменениями outerdata?.address и обновляем address
    if (outerdata?.price && outerdata?.price !== price) {
      setPrice(outerdata?.price);
    }
  }, [outerdata?.price]);

  useEffect(() => {
    // В этом эффекте следим за изменениями outerdata?.address и обновляем address
    if (outerdata?.amount && outerdata?.amount !== value) {
      setValue(outerdata?.amount);
    }
  }, [outerdata?.amount]);

  useEffect(() => {
    // В этом эффекте следим за изменениями outerdata?.address и обновляем address
    if (outerdata?.coords && outerdata?.coords !== address) {
      setSelectedAddress(outerdata?.coords);
    }
  }, [outerdata?.coords]);

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

    if (!value) {
      setPrice(null);
      setSelectedAddress(null);
    }
  };

  const handleSuggestionSelect = (selectedSuggestion) => {
    setAddress(selectedSuggestion.value);
    setSelectedAddress([
      +selectedSuggestion.data.geo_lat,
      +selectedSuggestion.data.geo_lon,
    ]);

    const geo_lat = +selectedSuggestion.data.geo_lat,
      geo_lon = +selectedSuggestion.data.geo_lon;

    axios
      .post(
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address",
        {
          lat: geo_lat,
          lon: geo_lon,
          radius_meters: 200, // Задайте желаемое количество результатов
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
        if (response.data.suggestions.length > 0) {
          let poly = turf.polygon([
            KADCoords.map((coord) => coord.map(parseFloat)),
          ]);
          let pt = turf.point([parseFloat(geo_lon), parseFloat(geo_lat)]);

          let isInsideKAD = turf.booleanPointInPolygon(pt, poly);

          if (isInsideKAD) {
            // Точка находится внутри КАД
            // console.log("Точка находится внутри КАД.");
            console.log("Price: " + configPrice.fixedPrice);
            setPrice(configPrice.fixedPrice);
          } else {
            // Точка не находится внутри КАД
            console.log("Точка не находится внутри КАД.");
            let closestPoint = turf.nearestPoint(
              pt,
              turf.featureCollection(KADCoords.map((el) => turf.point(el)))
            );

            // Рассчитать расстояние
            let distance = turf.distance(pt, closestPoint, {
              units: "kilometers",
            });

            // console.log(`Расстояние до ближайшей точки КАД: ${distance} км`);
            // console.log(
            //   `Координаты ближайшей точки КАД: ${closestPoint.geometry.coordinates.join(
            //     ", "
            //   )}`
            // );
            console.log(
              "Price: " +
                (Math.round(distance) * configPrice.pricePerKm +
                  configPrice.fixedPrice)
            );
            setPrice(
              Math.round(distance) * configPrice.pricePerKm +
                configPrice.fixedPrice
            );
          }

          const suggestion = response.data.suggestions[0];
          setAddress(suggestion.value);
          setSelectedAddress([
            +suggestion.data.geo_lat,
            +suggestion.data.geo_lon,
          ]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setSuggestions([]);
  };

  const handleMapClick = (e) => {
    const coordinates = e.get("coords");
    const geo_lat = coordinates[0];
    const geo_lon = coordinates[1];

    // Запрос к API DaData.ru для получения адреса по координатам
    axios
      .post(
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address",
        {
          lat: geo_lat,
          lon: geo_lon,
          radius_meters: 200, // Задайте желаемое количество результатов
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
        if (response.data.suggestions.length > 0) {
          let poly = turf.polygon([
            KADCoords.map((coord) => coord.map(parseFloat)),
          ]);
          let pt = turf.point([parseFloat(geo_lon), parseFloat(geo_lat)]);

          let isInsideKAD = turf.booleanPointInPolygon(pt, poly);

          if (isInsideKAD) {
            // Точка находится внутри КАД
            // console.log("Точка находится внутри КАД.");
            console.log("Price: " + configPrice.fixedPrice);
            setPrice(configPrice.fixedPrice);
          } else {
            // Точка не находится внутри КАД
            console.log("Точка не находится внутри КАД.");
            let closestPoint = turf.nearestPoint(
              pt,
              turf.featureCollection(KADCoords.map((el) => turf.point(el)))
            );

            // Рассчитать расстояние
            let distance = turf.distance(pt, closestPoint, {
              units: "kilometers",
            });

            // console.log(`Расстояние до ближайшей точки КАД: ${distance} км`);
            // console.log(
            //   `Координаты ближайшей точки КАД: ${closestPoint.geometry.coordinates.join(
            //     ", "
            //   )}`
            // );
            console.log(
              "Price: " +
                (Math.round(distance) * configPrice.pricePerKm +
                  configPrice.fixedPrice)
            );
            setPrice(
              Math.round(distance) * configPrice.pricePerKm +
                configPrice.fixedPrice
            );
          }

          const suggestion = response.data.suggestions[0];
          setAddress(suggestion.value);
          setSelectedAddress([
            +suggestion.data.geo_lat,
            +suggestion.data.geo_lon,
          ]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleIncrement = () => {
    setValue((prevValue) => (prevValue < 20 ? prevValue + 1 : prevValue));
  };

  const handleDecrement = () => {
    setValue((prevValue) => (prevValue > 1 ? prevValue - 1 : prevValue));
  };

  const handleBlur = (event) => {
    const inputValue = event.target.value;
    if (inputValue.trim() === "") {
      setValue(1);
    }
  };

  function formatNumberWithCommas(number) {
    const parts = number.toString().split(".");
    const integerPart = parts[0];
    const integerPartWithCommas = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "."
    );

    return `${integerPartWithCommas}`;
  }

  var getInputNumbersValue = function (input) {
    // Return stripped input value — just numbers
    return input.value.replace(/\D/g, "");
  };

  var onPhonePaste = function (e) {
    var input = e.target,
      inputNumbersValue = getInputNumbersValue(input);
    var pasted = e.clipboardData || window.clipboardData;
    if (pasted) {
      var pastedText = pasted.getData("Text");
      if (/\D/g.test(pastedText)) {
        // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
        // formatting will be in onPhoneInput handler
        // input.value = inputNumbersValue;
        setPhoneNumber(inputNumbersValue)
        return;
      }
    }
  };

  var onPhoneInput = function (e) {
    var input = e.target,
      inputNumbersValue = getInputNumbersValue(input),
      selectionStart = input.selectionStart,
      formattedInputValue = "";

    if (!inputNumbersValue) {
      return (input.value = "");
    }

    if (input.value.length != selectionStart) {
      // Editing in the middle of input, not last symbol
      if (e.data && /\D/g.test(e.data)) {
        // Attempt to input non-numeric symbol
        input.value = inputNumbersValue;
        setPhoneNumber(inputNumbersValue)
      }
      return;
    }

    if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
      if (inputNumbersValue[0] == "9")
        inputNumbersValue = "7" + inputNumbersValue;
      var firstSymbols = inputNumbersValue[0] == "8" ? "8" : "+7";
      formattedInputValue = input.value = firstSymbols + " ";
      if (inputNumbersValue.length > 1) {
        formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
      }
      if (inputNumbersValue.length >= 5) {
        formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
      }
      if (inputNumbersValue.length >= 8) {
        formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
      }
      if (inputNumbersValue.length >= 10) {
        formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
      }
    } else {
      formattedInputValue = "+" + inputNumbersValue.substring(0, 16);
    }
    setPhoneNumber(formattedInputValue)
  };
  var onPhoneKeyDown = function (e) {
    // Clear input after remove last symbol
    var inputValue = e.target.value.replace(/\D/g, "");
    if (e.keyCode === 8 && inputValue.length === 1) {
      setPhoneNumber('')
    }
  };

  const handleChange = (event) => {
    // Используем регулярное выражение для удаления всех символов, кроме цифр
    const sanitizedValue = event.target.value.replace(/\D/g, ""); // \D - это регулярное выражение для нецифровых символов
    const numericValue = parseInt(sanitizedValue, 10);

    if (sanitizedValue === "" || isNaN(numericValue)) {
      setValue(""); // Если после удаления символов не осталось цифр, устанавливаем 1
    } else {
      const clampedValue = Math.min(20, numericValue); // Ограничиваем значение 20
      setValue(clampedValue);
    }
  };

  function handleNameChange(e) {
    const { value } = e.target;
    setName(value);
  }

  function handleEmailChange(e) {
    const { value } = e.target;
    setEmail(value);
  }

  function handleCheckOrder(e) {
    setPrevData({
      name: name,
      email: email,
      price: price,
      amount: value,
      address: address,
      phone: phoneNumber
    });

    console.log({
      name: name,
      email: email,
      price: price,
      amount: value,
      address: address,
      phone: phoneNumber
    });
  }

  async function sendEmail(data) {
    const params = {
      sender: prevData.email,
      to: "kwabshid@gmail.com",
      subject: "Заказ на сайте",
      replyto: prevData.email,
      message: `Имя: ${prevData.name}\n 
      Адрес: ${prevData.address}\n
      Email: ${prevData.email}\n
      Количество кабинок: ${prevData.amount}\n
      Цена: ${prevData.price * prevData.amount}\n
      Телефон: ${prevData.phone}\n`,
    };

    await emailjs.send(
      "service_s835tar",
      "template_ijy3k7o",
      params,
      "L_q7N78Gy8_eqJGF1"
    );

    setPrevData(null);
    setIsOrderComplete(true);
  }


  function clearOrder(e){
    setPrevData(null);
    setIsOrderComplete(false)
  }

  return (
    <div className="map_component">
      <div className={`map_body ${isOrderComplete ? 'huge' : ''}`}>
        {!prevData && !isOrderComplete && (
          <div className="inputs">
            <h3>Введите данные.</h3>
            <p>Необходимо заполните все указанные поля!</p>
            <div className="map_address">
              {/* <label>Почта:</label> */}
              <input
                type="text"
                placeholder="Имя..."
                value={name}
                onChange={handleNameChange}
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
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="map_address">
              <input
                type="tel"
                onKeyDown={onPhoneKeyDown}
                onPaste={onPhonePaste}
                onInput={onPhoneInput}
                placeholder="Ваш телефон..."
                maxlength="18"
                id="phoneInput"
                value={phoneNumber}
              />
            </div>
            <div className="number-input">
              <button onClick={handleDecrement}>-</button>
              <input
                type="text"
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button onClick={handleIncrement}>+</button>
            </div>
            <button
              onClick={handleCheckOrder}
              className={`${
                !(name && value && address && phoneNumber) ? "inactive" : ""
              }`}
            >
              Оформить
            </button>
          </div>
        )}
        {!prevData && !isOrderComplete && (
          <div className="order_body--map">
            <MapComponent
              selectedAddress={selectedAddress}
              handleMapClick={handleMapClick}
            />
          </div>
        )}
        {prevData && price && !isOrderComplete && (
          <div className="result">
            <div
              className="result_back--btn"
              onClick={(e) => setPrevData(null)}
            >
              Назад
            </div>
            <h1 className="result_title">Проверьте данные:</h1>
            {/* <p className="result_price">
              Цена: 
              {formatNumberWithCommas(prevData.price * prevData.amount)} ₽
            </p> */}
            <ul className="result_datalist">
              <li className="result_datalist--item">
                <p className="result_datalist--title">Имя:</p>
                <p className="result_datalist--value">{prevData.name}</p>
              </li>
              <li className="result_datalist--item">
                <p className="result_datalist--title">Адрес:</p>
                <p className="result_datalist--value">{prevData.address}</p>
              </li>
              <li className="result_datalist--item">
                <p className="result_datalist--title">Почта:</p>
                <p className="result_datalist--value">{prevData.email}</p>
              </li>
              <li className="result_datalist--item">
                <p className="result_datalist--title">Количество:</p>
                <p className="result_datalist--value">{prevData.amount}</p>
              </li>
              <li className="result_datalist--item">
                <p className="result_datalist--title">Телефон:</p>
                <p className="result_datalist--value">{prevData.phone}</p>
              </li>
              <li className="result_datalist--item">
                <p className="result_datalist--title">Цена:</p>
                <p className="result_datalist--value">
                  {formatNumberWithCommas(prevData.price * prevData.amount)} ₽
                </p>
              </li>
            </ul>
            <p className="result_info">
              Цена, указанная здесь, является предварительной и может немного
              измениться после оформления заказа. Окончательная стоимость будет
              подтверждена нашим оператором после тщательной проверки заказа.
            </p>
            <button className="result_order" onClick={sendEmail}>
              Заказать
            </button>
          </div>
        )}
        {isOrderComplete && (
          <div className="order_complete">
            <h1>
              Спасибо! Ваша заявка принята, специалист свяжется с Вами в ближайшее время.
            </h1>
            <div class="container">
              <div class="action">
                <div class="trophy">
                  <svg
                    fill="#3bd427"
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"></path>
                  </svg>
                </div>
                <div class="confetti"></div>
                <div class="confetti two"></div>
                <div class="confetti three"></div>
                <div class="confetti four"></div>
                <div class="confetti--purple"></div>
                <div class="confetti--purple two"></div>
                <div class="confetti--purple three"></div>
                <div class="confetti--purple four"></div>
              </div>
            </div>
            <button onClick={clearOrder}>Повторить заказ</button>
          </div>
          
        )}
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
