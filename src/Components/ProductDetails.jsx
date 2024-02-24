import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "qrcode.react";
import { fetchProducts } from "../Utils/Api";
import { useShoppingCart } from "../Contexts/ShoppingCartContext";
import { toast } from "react-toastify";
import CartIcon from "../Pages/CartIcon";
import ProductDetailsPage from "../Pages/ProductDetailsPage";

import Slider from "react-slick";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart, addedToCartIds } = useShoppingCart();
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    const getProductDetails = async () => {
      const data = await fetchProducts();
      const selectedProduct = data.find((p) => p.id === parseInt(id, 10));
      setProduct(selectedProduct);
    };

    getProductDetails();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    addToCart(product.id);
    toast.success("Added to Cart", { position: "top-center", autoClose: 1000 });
  };

  const handleAddToFavourite = () => {
    // Toggle the favorite state
    setIsFavourite((prevIsFavourite) => !prevIsFavourite);
  };

  const sliderSettings = {
    customPaging: function (i) {
      return (
        <a>
          <img src={product.images[i]} alt={`Thumbnail ${i + 1}`} />
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Constructing the data string
  const componentsString = product.components.map(component => `${component.name}: ${component.origin}`).join('\n');
  const dataString = `
    Title: ${product.title}\n
    Price: $${product.price}\n
    Brand: ${product.brand}\n
    Supplier: ${product.supplier}\n
    Components:\n${componentsString}\n
    Stock: ${product.stock}\n 
  `;


  return (
    <div className="container mx-auto my-8 min-h-screen">
      <h2 className="text-3xl font-bold p-3 mb-4">{product.title}</h2>
      <div className="grid grid-cols-1 p-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Slider {...sliderSettings}>
          {product.images.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="mb-4 w-72 h-72 object-cover mx-auto flex items-center"
              />
            </div>
          ))}
        </Slider>
        <div className="p-3">
          <p className="text-gray-600 font-semibold mb-2">
            Description: <span className="font-normal text-gray-500">{product.description}</span> 
          </p>
          <p className="text-gray-900 text-xl font-semibold mb-2">
            Price: ${product.price}
          </p>
          <p className="text-gray-700 font-semibold mb-2">
            Brand: {product.brand}
          </p>
          <p className="text-gray-700 font-semibold mb-2">
            Discount:{" "}
            <span className="text-red-500">{product.discountPercentage}%</span>
          </p>
          <p className="text-gray-700 font-semibold mb-2">
            Rating: {product.rating}
          </p>

          <div className="mb-4">
           <p className="text-red-700 text-sm  mb-2">Scan QR Code to get Authentic info about this product</p> 
          <QRCode value={dataString} />
          </div>

          <div className="flex items-center space-x-2">
          <button
            onClick={() => handleAddToCart(product.id)}
            className={`flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
              addedToCartIds.includes(product.id)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={addedToCartIds.includes(product.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            Add to cart
          </button>
          <button
            onClick={handleAddToFavourite}
            className={`flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus:ring-3 focus:ring-red-300`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{
                fill: isFavourite
                  ? "rgba(255, 0, 0, 1)"
                  : "rgba(255, 255, 255, 1)",
              }}
            >
              <path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z"></path>
            </svg>
            {isFavourite ? "Added to Favourites" : "Add to Favourites"}
          </button>
          </div>
        </div>
      </div>
      <CartIcon />
      <ProductDetailsPage />
    </div>
  );
};

export default ProductDetails;
