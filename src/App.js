import "./css/app.css";
import { useState, useEffect } from "react";

import logo from "./assets/logo.png";

import WinnerIcon from "./assets/winner.png";
import SpeedIcon from "./assets/speed.png";
import SettingIcon from "./assets/setting.png";

import AddressAutocomplete from "./components/SelectRoute";

function App() {
  const [currentElem, setCurrentElem] = useState(0);
  // const [activeIndex, setActiveIndex] = useState(0);
  // const [timer, setTimer] = useState(null);


  function handleSelectItem(e) {
    const menuItems = Array.from(document.querySelectorAll(".menu_item"));

    menuItems.forEach((value, index, array) => {
      console.log(value);
      console.log(e.target);
      if (value === e.target) {
        setCurrentElem(index);
      }
    });
  }



  const slideCount = 4; // Количество слайдов
  const [activeIndex, setActiveIndex] = useState(0); // Индекс активного слайда
  let timer; // Таймер

  // Функция для автоматического переключения слайдов
  const autoSlide = () => {
    const nextIndex = (activeIndex + 1) % slideCount;
    setActiveIndex(nextIndex);
  };

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


  return (
    <div className="App">
      <header className="header">
        <div className="nav_container">
          <nav className="nav_content">
            <div className="logo">
              <img src={logo} />
              <p>
                <span>Bio</span>Cabines
              </p>
            </div>
            <ul className="menu">
              <li
                onClick={handleSelectItem}
                className={`menu_item ${currentElem === 0 ? "active" : ""}`}
              >
                Главная
              </li>
              <li
                onClick={handleSelectItem}
                className={`menu_item ${currentElem === 1 ? "active" : ""}`}
              >
                О нас
              </li>
              <li
                onClick={handleSelectItem}
                className={`menu_item ${currentElem === 2 ? "active" : ""}`}
              >
                Отзывы
              </li>
              <li
                onClick={handleSelectItem}
                className={`menu_item ${currentElem === 3 ? "active" : ""}`}
              >
                Заказать
              </li>
              <li
                onClick={handleSelectItem}
                className={`menu_item ${currentElem === 4 ? "active" : ""}`}
              >
                Контакты
              </li>
            </ul>
          </nav>
        </div>
        <div className="header_body">
          <div className="content">
            <p className="from">Цена от 3500₽</p>
            <h1 className="title">
              Биотуалеты в аренду: Выбор <br /> для мгновенного комфорта. <br />{" "}
              Просто и выгодно!
            </h1>
            <p className="sub_title">
              Быстрая доставка биотуалетов: Комфорт без границ <br /> в
              Санкт-Петербурге и области. Удовлетворьте ваши потребности,
              <br /> где бы вы ни находились!
            </p>
            <button className="button">Оформить заказ</button>
          </div>
          <div className="image"></div>
        </div>
      </header>
      <main className="main">
        <section className="choose">
          <h2 className="section_title">Почему нас стоит выбирать?</h2>
          <ul className="section_list_feature">
            <li className="section_list_feature__item">
              <img src={WinnerIcon} alt="icon_feature" />
              <p>
                <span>4000+</span> заказов выполнили за все время работы{" "}
              </p>
            </li>
            <li className="section_list_feature__item">
              <img src={SpeedIcon} alt="icon_feature" />
              <p>
                <span>Быстро</span> доставим кабинки на указанное место{" "}
              </p>
            </li>
            <li className="section_list_feature__item">
              <img src={SettingIcon} alt="icon_feature" />
              <p>
                <span>Гибко</span> подберем уникальные <br /> условия для вас{" "}
              </p>
            </li>
          </ul>
        </section>
        <section className="review">
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
                      src="https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg"
                      alt="review_photo"
                    />
                    <h2 className="review_name">Велерьев Валерий Валерьевич</h2>
                  </div>
                  <p className="review_text">
                    Я заказал биокабинку в аренду у этой компании, и был приятно
                    удивлен их профессионализмом и обслуживанием. Биокабинка
                    была доставлена вовремя, и она была чистой и ухоженной. Я
                    также оценил удобство и комфорт, которые она предоставила
                    нашей стройплощадке. Определенно, это был правильный выбор
                    для нашего проекта. Спасибо за вашу надежность и отличный
                    сервис!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">18</p>
                    <p className="review_date">12.09.2023</p>
                  </div>
                </li>
                <li className="review_list__item">
                  <div className="review_list__item--header">
                    <img
                      width={54}
                      height={54}
                      src="https://img.freepik.com/free-photo/handsome-bearded-guy-posing-against-the-white-wall_273609-20597.jpg"
                      alt="review_photo"
                    />
                    <h2 className="review_name">Иванов Иван Иванович</h2>
                  </div>
                  <p className="review_text">
                    Мы арендовали биокабинку для мероприятия на природе, и это
                    был отличный опыт. Быстрая доставка и установка сделали всю
                    процедуру максимально удобной. Биокабинка была чистой,
                    снабжена всеми удобствами, и даже имела приятный запах.
                    Гости были впечатлены комфортом, и это добавило позитивного
                    настроения нашему мероприятию. Определенно, рекомендую эту
                    компанию для аренды биокабинок!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">6</p>
                    <p className="review_date">12.09.2023</p>
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
                      src="https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFufGVufDB8fDB8fHww&w=1000&q=80"
                      alt="review_photo"
                    />
                    <h2 className="review_name">Велерьев Валерий Валерьевич</h2>
                  </div>
                  <p className="review_text">
                    Мы арендовали биокабинку для мероприятия, и наш опыт был
                    превосходным. Компания проявила профессионализм и
                    предоставила нам чистую и ухоженную биокабинку вовремя. Её
                    удобства сделали наше мероприятие ещё более комфортным.
                    Определенно, лучший выбор для любого проекта. Спасибо за
                    надежность и отличный сервис!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">32</p>
                    <p className="review_date">12.09.2023</p>
                  </div>
                </li>
                <li className="review_list__item">
                  <div className="review_list__item--header">
                    <img
                      width={54}
                      height={54}
                      src="https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg"
                      alt="review_photo"
                    />
                    <h2 className="review_name">Иванов Иван Иванович</h2>
                  </div>
                  <p className="review_text">
                    Я взял в аренду биокабинку у этой компании и был приятно
                    удивлен. Они действительно профессионально подошли к
                    обслуживанию. Биокабинка была чистой и аккуратной,
                    доставлена вовремя. Она добавила комфорта нашей
                    стройплощадке. Рекомендую эту компанию - надежность и
                    отличный сервис!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">25</p>
                    <p className="review_date">12.09.2023</p>
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
                      src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?cs=srgb&dl=pexels-italo-melo-2379004.jpg&fm=jpg"
                      alt="review_photo"
                    />
                    <h2 className="review_name">Велерьев Валерий Валерьевич</h2>
                  </div>
                  <p className="review_text">
                    Арендовали биокабинку у этой компании, и остались довольны.
                    Профессионализм и чистота биокабинки нас приятно удивили.
                    Она была доставлена в точное время и стала настоящим
                    удобством на нашей стройплощадке. Решение было правильным.
                    Спасибо за ваш отличный сервис!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">31</p>
                    <p className="review_date">12.09.2023</p>
                  </div>
                </li>
                <li className="review_list__item">
                  <div className="review_list__item--header">
                    <img
                      width={54}
                      height={54}
                      src="https://img.freepik.com/premium-photo/young-handsome-man-with-beard-isolated-keeping-arms-crossed-frontal-position_1368-132662.jpg"
                      alt="review_photo"
                    />
                    <h2 className="review_name">Иванов Иван Иванович</h2>
                  </div>
                  <p className="review_text">
                    Мы заказали биокабинку у этой компании, и получили отличный
                    опыт. Профессиональный подход и чистота биокабинки нас
                    приятно удивили. Она была доставлена вовремя и обеспечила
                    комфорт на нашей стройплощадке. Определенно, правильный
                    выбор для нашего проекта. Спасибо за вашу надежность и
                    отличный сервис!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">4</p>
                    <p className="review_date">12.09.2023</p>
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
                      src="https://media.istockphoto.com/id/1319763895/photo/smiling-mixed-race-mature-man-on-grey-background.jpg?s=612x612&w=0&k=20&c=ZiuzNX9LhTMMcRFrYNfq_zFR7O_aH-q7x1L5elko5uU="
                      alt="review_photo"
                    />
                    <h2 className="review_name">Велерьев Валерий Валерьевич</h2>
                  </div>
                  <p className="review_text">
                    Недавно арендовал биокабинку у этой компании, и остался
                    доволен. Их профессионализм и чистота биокабинки приятно
                    удивили. Она была доставлена вовремя и предоставила удобство
                    нашей стройплощадке. Это был правильный выбор для нашего
                    проекта. Большое спасибо за вашу надежность и отличный
                    сервис!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">27</p>
                    <p className="review_date">12.09.2023</p>
                  </div>
                </li>
                <li className="review_list__item">
                  <div className="review_list__item--header">
                    <img
                      width={54}
                      height={54}
                      src="https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVufGVufDB8fDB8fHww&w=1000&q=80"
                      alt="review_photo"
                    />
                    <h2 className="review_name">Иванов Иван Иванович</h2>
                  </div>
                  <p className="review_text">
                    Заказал аренду биокабинки у этой компании, и остался приятно
                    удивлен. Профессионализм и чистота биокабинки были на высшем
                    уровне. Она была доставлена вовремя и добавила комфорта
                    нашей стройплощадке. Рекомендую эту компанию - надежность и
                    отличный сервис!
                  </p>
                  <div className="reveiw_bottom">
                    <p className="review_like">53</p>
                    <p className="review_date">12.09.2023</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="slider-dots">
              {[0, 1, 3, 4].map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === activeIndex ? "active-dot" : ""}`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="order">
          <h2 className="section_title">Заказать биотуалет</h2>
          <AddressAutocomplete />
        </section>
      </main>
      <footer className="footer">
        <div className="footer_body">
          <div className="logo">
            <img src={logo} />
            <p>
              <span>Bio</span>Cabines
            </p>
          </div>
          <ul className="menu">
            <li className={`menu_item `}>Главная</li>
            <li className={`menu_item`}>О нас</li>
            <li className={`menu_item`}>Отзывы</li>
            <li className={`menu_item`}>Заказать</li>
            <li className={`menu_item`}>Контакты</li>
          </ul>
          <div className="contact">
            <h2>
              Телефон <br /> для обратной связи
            </h2>
            <div className="input_container">
              <input type="text" placeholder="Почта..." />
            </div>
          </div>
        </div>
        <p className="footer_copy">© BioCabines, All rights reserved, 2023</p>
      </footer>
    </div>
  );
}

export default App;
