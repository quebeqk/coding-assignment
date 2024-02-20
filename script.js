function fetchData() {
  fetch(
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448"
  )
    .then((response) => response.json())
    .then((data) => {
      const product = data.product;

      const productPrice = product.price;
      const productCompare = product.compare_at_price;

      document.getElementById("product-vendor").innerHTML = product.vendor;
      document.getElementById("product-title").innerHTML = product.title;
      document.getElementById("product-description").innerHTML =
        product.description;
      document.getElementById("product-price").textContent =
        productPrice + ".00";
      document.getElementById("product-compareatprice").textContent =
        productCompare + ".00";

      document.getElementById("discount-percent").textContent = `${(
        (1 -
          productPrice.replace("$", "").trim() /
            productCompare.replace("$", "").trim()) *
        100
      ).toFixed(0)}% off`;

      // Rendering colour options
      const colorPalette = document.getElementById("color-palette");
      product.options
        .find((option) => option.name === "Color")
        .values.forEach((color) => {
          const colorPlate = document.createElement("div");
          colorPlate.classList.add("color-plate");
          const colorName = Object.keys(color)[0];
          colorPlate.style.backgroundColor = color[colorName];
          colorPlate.setAttribute("data-color", colorName);
          colorPalette.appendChild(colorPlate);
        });

      // Rendering size options
      const sizeOptionsContainer = document.getElementById("size-options");
      sizeOptionsContainer.innerHTML = "";
      const sizeValues = product.options.find(
        (option) => option.name === "Size"
      ).values;
      sizeValues.forEach((size) => {
        const sizeSpan = document.createElement("span");
        const radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.name = "size";
        radioInput.value = size;
        sizeSpan.appendChild(radioInput);
        sizeSpan.appendChild(document.createTextNode(size));
        sizeOptionsContainer.appendChild(sizeSpan);
      });

      const sizeOptions = document.querySelectorAll(
        "#size-options input[type='radio']"
      );
      sizeOptions.forEach((sizeOption) => {
        sizeOption.addEventListener("change", function () {
          obj.selectedSize = sizeOption.value;
        });
      });
    })
    .catch((error) => console.error("Error fetching product data:", error));
}

const incrementCount = document.getElementById("increment-count");
const decrementCount = document.getElementById("decrement-count");
const totalCount = document.getElementById("total-count");

var count = parseInt(totalCount.textContent);

const handleIncrement = () => {
  count++;
  totalCount.textContent = count;
  decrementCount.disabled = false;
};

const handleDecrement = () => {
  if (count > 1) {
    count--;
    totalCount.textContent = count;
  }

  if (count === 1) {
    decrementCount.disabled = true;
  }
};

incrementCount.addEventListener("click", handleIncrement);
decrementCount.addEventListener("click", handleDecrement);

let obj = {
  selectedColor: "",
  selectedSize: "",
};
document.addEventListener("DOMContentLoaded", function () {
  fetchData();

  let selectedColor = null;
  let selectedSize = null;

  function selectColor(colorPlate) {
    if (selectedColor === colorPlate) {
      return;
    }
    if (selectedColor) {
      selectedColor.classList.remove("active");
      selectedColor.innerHTML = "";
    }

    selectedColor = colorPlate;
    selectedColor.classList.add("active");
    selectedColor.innerHTML = '<i class="fa fa-check"></i>';
    selectedColor.style.border = "2px solid white";

    obj.selectedColor = colorPlate.getAttribute("data-color");
  }

  const colorPalette = document.getElementById("color-palette");
  colorPalette.addEventListener("click", function (event) {
    if (event.target.classList.contains("color-plate")) {
      selectColor(event.target);
    }
  });

  document
    .getElementById("add-to-cart-btn")
    .addEventListener("click", function () {
      if (obj.selectedColor !== "" && obj.selectedSize !== "") {
        const message = `Embrace Sideboard with Color ${obj.selectedColor} and Size ${obj.selectedSize} added to cart.  `;
        document.getElementById("cart-message").textContent = message;
        document.getElementById("cart-messagediv").style.display = "block";
      } else {
        document.getElementById("cart-messagediv").style.display = "block";
        document.getElementById("cart-message").textContent =
          "Please select color and size before adding to cart!";
      }
    });
});
