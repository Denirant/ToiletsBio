import "./css/app.css";
import { useState, useEffect } from "react";

import logo from "./assets/logo.png";

import WinnerIcon from "./assets/winner.png";
import SpeedIcon from "./assets/speed.png";
import SettingIcon from "./assets/setting.png";

import SaveIcon from "./assets/save.png";
import HourlyIcon from "./assets/hourly.png";
import DepositIcon from "./assets/deposit.png";
import PaymentIcon from "./assets/payment.png";
import MapIcon from "./assets/map.png";

import AddressAutocomplete from "./components/SelectRoute";
import MapComponent from "./components/MapComponent/MapComponent";

import axios from "axios";

import * as turf from "@turf/turf";
import KADCoords from "./utils/KAD";
import configPrice from "./config/data.json";

import telegramIcon from "./assets/telegram.png";
import whatsappIcon from "./assets/whatsapp.png";
import viberIcon from "./assets/viber.png";
import emailIcon from "./assets/email.png";

import emailjs from "@emailjs/browser";

import avitoIcon from './assets/avito.png'

function App() {
  const [currentElem, setCurrentElem] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState(1);
  const [address, setAddress] = useState("");

  const [shortData, setShortData] = useState(null);
  const [price, setPrice] = useState(null);

  async function onPhoneSend(e) {
    if (document.querySelector("#phoneInput").value) {
      const params = {
        sender: "WebSite@mail.ru",
        to: "kwabshid@gmail.com",
        subject: "Заявка на обратную связь",
        replyto: "WebSite@mail.ru",
        message: `Оставлена заявка на сайте, перезвоните по телефону: ${
          document.querySelector("#phoneInput").value
        }`,
      };

      await emailjs.send(
        "service_s835tar",
        "template_ijy3k7o",
        params,
        "L_q7N78Gy8_eqJGF1"
      );

      document.querySelector("#phoneInput").value = "";

      alert("Заявка была отправлена, ожидайте звонка!");
    }
  }

  function handleSelectItem(e) {
    const menuItems = Array.from(document.querySelectorAll(".menu_item a"));

    menuItems.forEach((value, index, array) => {
      console.log(value);
      console.log(e.target);
      if (value === e.target) {
        setCurrentElem(index);
      }
    });
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
        input.value = inputNumbersValue;
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
    input.value = formattedInputValue;
  };
  var onPhoneKeyDown = function (e) {
    // Clear input after remove last symbol
    var inputValue = e.target.value.replace(/\D/g, "");
    if (e.keyCode === 8 && inputValue.length === 1) {
      e.target.value = "";
    }
  };

  const handleAddressChange = (e) => {
    const { value } = e.target;
    setAddress(value);

    // Запрос к API DaData.ru для получения подсказок по адресу
    axios
      .post(
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
        {
          query: value,
          count: 25,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Token 4f78ef3fe06b3ce5d2a437cfc7df8792df198e27",
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

  const slideCount = 5; // Количество слайдов
  const [activeIndex, setActiveIndex] = useState(0); // Индекс активного слайда
  let timer; // Таймер

  // Функция для автоматического переключения слайдов
  const autoSlide = () => {
    const nextIndex = (activeIndex + 1) % slideCount;
    setActiveIndex(nextIndex);
  };

  const [orderData, setOrderData] = useState(null);

  // Запускаем автоматическое переключение при монтировании компонента
  useEffect(() => {
    timer = setInterval(autoSlide, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [activeIndex, slideCount]);

  // Обработчик событий для точек
  const handleDotClick = (index) => {
    clearInterval(timer); // Останавливаем предыдущий таймер
    setActiveIndex(index);
    // Запускаем новый таймер с учетом текущего кликнутого индекса
    timer = setInterval(autoSlide, 5000);
  };

  const handleIncrement = () => {
    setValue((prevValue) => (prevValue < 20 ? prevValue + 1 : prevValue));
  };

  const handleDecrement = () => {
    setValue((prevValue) => (prevValue > 1 ? prevValue - 1 : prevValue));
  };

  const [selectedAddress, setSelectedAddress] = useState(null);

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

            console.log(`Расстояние до ближайшей точки КАД: ${distance} км`);
            console.log(
              `Координаты ближайшей точки КАД: ${closestPoint.geometry.coordinates.join(
                ", "
              )}`
            );
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

  const handleBlur = (event) => {
    const inputValue = event.target.value;
    if (inputValue.trim() === "") {
      setValue(1);
    }
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

  function handleMakeCalc(e) {
    if (!address) {
      setShortData(null);
      return alert("Введите адрес");
    }

    console.log(price);

    setShortData({
      address: address,
      coords: selectedAddress,
      amount: value,
      price: price,
    });
  }

  function formatNumberWithCommas(number) {
    const parts = number.toString().split(".");
    const integerPart = parts[0];
    const integerPartWithCommas = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "."
    );

    return `${integerPartWithCommas}`;
  }

  function handleHrefOrder() {
    window.location = "#order";
    setOrderData(shortData);
  }

  function handleLogoClick(e){
    window.location = "/"
  }

  return (
    <div className="App" id="home">
      <header className="header">
        <div className="nav_container">
          <nav className="nav_content">
            <div className="logo" onClick={handleLogoClick}>
              <img src={logo} alt="logo icon"/>
              <p>
                <span>Био</span>СПБ.рф
              </p>
            </div>
            <ul className="menu">
              <li
                onClick={handleSelectItem}
                className={`menu_item ${currentElem === 0 ? "active" : ""}`}
              >
                <a href="#home">Главная</a>
              </li>
              <li
                onClick={handleSelectItem}
                className={`menu_item ${currentElem === 1 ? "active" : ""}`}
              >
                <a href="#about">О нас</a>
              </li>
              <li
                onClick={handleSelectItem}
                className={`menu_item ${currentElem === 2 ? "active" : ""}`}
              >
                <a href="#review">Отзывы</a>
              </li>
              <li
                onClick={handleSelectItem}
                className={`menu_item ${currentElem === 3 ? "active" : ""}`}
              >
                <a href="#order">Заказать</a>
              </li>
              <li
                onClick={handleSelectItem}
                className={`menu_item ${currentElem === 4 ? "active" : ""}`}
              >
                <a href="#footer">Контакты</a>
              </li>
            </ul>
            <p className="nav_tel">
              <a className="nav_tel__link" href="tel:+79111169173">
                +7 (911) 116-91-73
              </a>
            </p>
          </nav>
        </div>
        <div className="header_body">
          <div className="content">
            <p className="from">Цена от 4500₽</p>
            <h1 className="title">
              Биотуалеты в аренду: Выбор <br /> для мгновенного комфорта. <br />{" "}
              Просто и выгодно!
            </h1>
            <p className="sub_title">
              Быстрая доставка биотуалетов: Комфорт без границ в
              Санкт-Петербурге и <br /> области. Удовлетворим ваши 
              потребности, где бы вы ни находились!
            </p>
            <div className="calculator_container">
              {!shortData && (
                <h2 className="calculator_title">Онлайн расчет стоимости</h2>
              )}
              <div className="calculator_body">
                {!shortData && (
                  <div className="calculator_body--inputs">
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
                  </div>
                )}
                {!shortData && (
                  <div className="calculator_body--map">
                    <MapComponent
                      selectedAddress={selectedAddress}
                      handleMapClick={handleMapClick}
                      width={650}
                      height={300}
                    />
                  </div>
                )}
                {!shortData && (
                  <button
                    className={`${!selectedAddress ? "inactive" : ""}`}
                    onClick={handleMakeCalc}
                  >
                    Рассчитать цену
                  </button>
                )}

                {shortData && price && (
                  <div className="result">
                    <div
                      className="result_back--btn"
                      onClick={(e) => setShortData(null)}
                    >
                      Назад
                    </div>
                    <h1 className="result_title">Ваша цена:</h1>
                    <p className="result_price">
                      {formatNumberWithCommas(price * shortData.amount)} ₽
                    </p>
                    <p className="result_info">
                      Цена, указанная здесь, является предварительной и может
                      немного измениться после оформления заказа. Окончательная
                      стоимость будет подтверждена нашим оператором после
                      тщательной проверки заказа.
                    </p>
                    <button className="result_order" onClick={handleHrefOrder}>
                      Заказать
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="image"></div>
        </div>
      </header>
      <main className="main">
        <section className="choose" id="about">
          {/* // Доступная цена от 4000 р месяц
          // Быстрая доставка втечении 30 часов
          // 24/7 работаем без выходных и праздников
          // По всей области и спб
          // Любая форма оплаты
          // Без залога и предоплат */}
          <h2 className="section_title">Почему нас стоит выбирать?</h2>
          <ul className="section_list_feature">
            <li className="section_list_feature__item">
              <img src={SaveIcon} alt="icon_feature" />
              <p>
                <span>Выгодно</span> Стоимость заказа кабинки <br /> от 4000₽{" "}
              </p>
            </li>
            <li className="section_list_feature__item">
              <img src={SpeedIcon} alt="icon_feature" />
              <p>
                <span>Быстро</span> Доставка в течение <br /> 30 часов{" "}
              </p>
            </li>
            <li className="section_list_feature__item">
              <img src={HourlyIcon} alt="icon_feature" />
              <p>
                <span>24/7</span> Работаем без выходных <br /> и праздников{" "}
              </p>
            </li>
          </ul>
          <ul className="section_list_feature">
            <li className="section_list_feature__item">
              <img src={DepositIcon} alt="icon_feature" />
              <p>
                <span>Без залога</span> Работаем без предоплат <br /> и залогов{" "}
              </p>
            </li>
            <li className="section_list_feature__item">
              <img src={PaymentIcon} alt="icon_feature" />
              <p>
                <span>Удобно</span> Оплачивайте любым удобным вам способом{" "}
              </p>
            </li>
            <li className="section_list_feature__item">
              <img src={MapIcon} alt="icon_feature" />
              <p>
                <span>Зона покрытия</span> Доставляем по всей <br /> области и
                Питеру{" "}
              </p>
            </li>
          </ul>
        </section>
        <section className="review" id="review">
          <h2 className="section_title white">Что о нас говорят?</h2>
          <div className="gallery">
            <div className="slider">
              <ul
                className={`review_list ${activeIndex === 0 ? "active" : ""}`}
              >
                <li className="review_list__item">
                  <div className="review_list__item--header">
                    <img
                      width={54}
                      height={54}
                      src={avitoIcon}
                      alt="review_photo"
                    />
                    <h2 className="review_name">Владимир</h2>
                  </div>
                  <p className="review_text">
                    Ребята молодцы, в день звонка привезли. Вроде просто туалет, а приятная оперативность.
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">18</p>
                    <p className="review_date">03.03.2023</p>
                  </div>
                </li>
                <li className="review_list__item">
                  <div className="review_list__item--header">
                    <img
                      width={54}
                      height={54}
                      src={avitoIcon}
                      alt="review_photo"
                    />
                    <h2 className="review_name">Максим</h2>
                  </div>
                  <p className="review_text">
                    Все привезли четко в срок, помогли с установкой. Ребята молодцы. Рекомендую!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">6</p>
                    <p className="review_date">03.03.2023</p>
                  </div>
                </li>
              </ul>
              <ul
                className={`review_list ${activeIndex === 1 ? "active" : ""}`}
              >
                <li className="review_list__item">
                  <div className="review_list__item--header">
                    <img
                      width={54}
                      height={54}
                      src={avitoIcon}
                      alt="review_photo"
                    />
                    <h2 className="review_name">Оксана</h2>
                  </div>
                  <p className="review_text">
                    Всем рекомендую! Туалет привезли в день обращения, самые низкие цены! Каждый месяц приезжают, чистят
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">32</p>
                    <p className="review_date">09.03.2023</p>
                  </div>
                </li>
                <li className="review_list__item">
                  <div className="review_list__item--header">
                    <img
                      width={54}
                      height={54}
                      src={avitoIcon}
                      alt="review_photo"
                    />
                    <h2 className="review_name">Иван</h2>
                  </div>
                  <p className="review_text">
                    У ребят взяли биотуалет на дачу. Цена адекватная, оперативно привезли и сами установили. Спасибо, рекомендую!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">25</p>
                    <p className="review_date">10.03.2023</p>
                  </div>
                </li>
              </ul>
              <ul
                className={`review_list ${activeIndex === 2 ? "active" : ""}`}
              >
                <li className="review_list__item">
                  <div className="review_list__item--header">
                    <img
                      width={54}
                      height={54}
                      src={avitoIcon}
                      alt="review_photo"
                    />
                    <h2 className="review_name">Михаил</h2>
                  </div>
                  <p className="review_text">
                    Все супер, через три часа после звонка, туалет уже был на участке. Причем в воскресенье. Цены ниже чем у конкурентов. Всем рекомендую!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">31</p>
                    <p className="review_date">26.03.2023</p>
                  </div>
                </li>
                <li className="review_list__item">
                  <div className="review_list__item--header">
                    <img
                      width={54}
                      height={54}
                      src={avitoIcon}
                      alt="review_photo"
                    />
                    <h2 className="review_name">Ринат</h2>
                  </div>
                  <p className="review_text">
                    Заказал кабинку на дачу в Санино 2 месяца назад. Цена не самая низкая, но тех кто может привезти в воскресенье нашел только их. Привезли быстро, Обслуживают по звонку в течении пары дней, к работе претензий нет!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">4</p>
                    <p className="review_date">24.03.2023</p>
                  </div>
                </li>
              </ul>
              <ul
                className={`review_list ${activeIndex === 3 ? "active" : ""}`}
              >
                <li className="review_list__item">
                  <div className="review_list__item--header">
                    <img
                      width={54}
                      height={54}
                      src={avitoIcon}
                      alt="review_photo"
                    />
                    <h2 className="review_name">Юрий</h2>
                  </div>
                  <p className="review_text">
                    Хорошая компания. Привезли, обслуживали в назначенные сроки. Работой доволен, рекомендую!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">27</p>
                    <p className="review_date">31.03.2023</p>
                  </div>
                </li>
                <li className="review_list__item">
                  <div className="review_list__item--header">
                    <img
                      width={54}
                      height={54}
                      src={avitoIcon}
                      alt="review_photo"
                    />
                    <h2 className="review_name">Алексей</h2>
                  </div>
                  <p className="review_text">
                    Туалет привезли очень быстро, через 2 часа. Стоимость услуг реально дешевле, чем у конкурентов. Все честно, вежливо и оперативно. Лучшие, рекомендую!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">53</p>
                    <p className="review_date">01.04.2023</p>
                  </div>
                </li>
              </ul>
              <ul
                className={`review_list ${activeIndex === 4 ? "active" : ""}`}
              >
                <li className="review_list__item">
                  <div className="review_list__item--header">
                    <img
                      width={54}
                      height={54}
                      src={avitoIcon}
                      alt="review_photo"
                    />
                    <h2 className="review_name">Алина</h2>
                  </div>
                  <p className="review_text">
                    Ребята, спасибо за оперативность! Все чисто, во время, персонал вежливый! Будем заказывать у вас еще!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">13</p>
                    <p className="review_date">4.04.2023</p>
                  </div>
                </li>
                <li className="review_list__item">
                  <div className="review_list__item--header">
                    <img
                      width={54}
                      height={54}
                      src={avitoIcon}
                      alt="review_photo"
                    />
                    <h2 className="review_name">Марина</h2>
                  </div>
                  <p className="review_text">
                    Отчличная организация! Оперативно оказали услугу! Цены самые приемлемые среди аналогичных предложений! Обслуживали в назначенное время! Всем рекомендую!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">42</p>
                    <p className="review_date">05.04.2023</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="slider-dots">
              {[0, 1, 3, 4, 5].map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === activeIndex ? "active-dot" : ""}`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="order" id="order">
          <h2 className="section_title">Заказать биотуалет</h2>
          <AddressAutocomplete outerdata={orderData} />
        </section>
      </main>
      <footer className="footer" id="footer">
        <div className="footer_body">
          <div className="logo" onClick={handleLogoClick}>
            <img src={logo} />
            <p>
              <span>Био</span>СПБ.рф
            </p>
          </div>
          <ul className="menu">
            <li className={`menu_item `}>
              <a href="#home">Главная</a>
            </li>
            <li className={`menu_item`}>
              <a href="#about">О нас</a>
            </li>
            <li className={`menu_item`}>
              <a href="#review">Отзывы</a>
            </li>
            <li className={`menu_item`}>
              <a href="#order">Заказать</a>
            </li>
            <li className={`menu_item`}>
              <a href="#footer">Контакты</a>
            </li>
          </ul>
          <div className="contact">
            <h2>Обратная связь</h2>
            <div className="input_container">
              <input
                type="tel"
                onKeyDown={onPhoneKeyDown}
                onPaste={onPhonePaste}
                onInput={onPhoneInput}
                placeholder="Ваш телефон..."
                maxlength="18"
                id="phoneInput"
              />
              <button className="input_send" onClick={onPhoneSend}></button>
            </div>
            <ul className="social_list">
              <li className="social_item whatsapp">
                {/* Whatsup */}
                <a
                  className="socila_item--link"
                  href="https://wa.me/79934759687"
                >
                  <img
                    width={24}
                    height={24}
                    src={whatsappIcon}
                    alt="social icon"
                  />
                </a>
              </li>
              <li className="social_item viber">
                {/* Viber */}
                <a
                  className="socila_item--link"
                  href="viber://chat?number=79934759687"
                >
                  <img
                    width={24}
                    height={24}
                    src={viberIcon}
                    alt="social icon"
                  />
                </a>
              </li>
              <li className="social_item email">
                {/* Email */}
                <a className="socila_item--link" href="mailto:biospbrf@mail.ru">
                  <img
                    width={24}
                    height={24}
                    src={emailIcon}
                    alt="social icon"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="footer_copy">© BioCabines, All rights reserved, 2023</p>
      </footer>
    </div>
  );
}

export default App;
