import React, { useState } from "react";
const images = [
  "https://www.allrecipes.com/thmb/0xH8n2D4cC97t7mcC7eT2SDZ0aE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/6776_Pizza-Dough_ddmfs_2x1_1725-fdaa76496da045b3bdaadcec6d4c5398.jpg",
  "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2021/02/05/Baked-Feta-Pasta-4_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1615916524567.webp",
  "https://www.unileverfoodsolutions.com.ph/dam/global-ufs/mcos/SEA/calcmenu/recipes/PH-recipes/the-vegetarian-butcher/nasvhille-hot-burger/1245x600_Nashville%20style%20Chicken%20Burger.jpg",
  "https://www.cobsbread.com/us/wp-content//uploads/2022/09/Pepperoni-pizza-850x630-1.png",
  "https://www.thechunkychef.com/wp-content/uploads/2017/08/One-Pot-Chicken-Parmesan-Pasta-feat.jpg",
  "https://www.shutterstock.com/image-photo/pour-melt-cheese-on-top-600nw-1522233638.jpg",
  "https://d4t7t8y8xqo0t.cloudfront.net/resized/750X436/eazytrendz%2F4108%2Ftrend20230915051203.jpg",
  "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2021/02/05/Baked-Feta-Pasta-4_s4x3.jpg.rend.hgtvcom.1280.1280.suffix/1615916524567.jpeg",
  "https://www.honestburgers.co.uk/wp-content/uploads/2018/08/buffalo-breast-web-social.jpg",
  "https://staticcookist.akamaized.net/wp-content/uploads/sites/22/2021/11/shrimp-pizza.jpg",
  "https://images.pexels.com/photos/3209101/pexels-photo-3209101.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/3764353/pexels-photo-3764353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

const ImageGallery = () => {
  return (
    <div className="gallery-container">
      {images.map((url, index) => (
        <div key={index} className="gallery-item">
          <img src={url} />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
