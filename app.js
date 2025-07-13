
function addProduct(event) {
  event.preventDefault();
  const data = gatherFormData();
  const newLine = createLine(data);
  injectLineIntoDOM(newLine);
  saveProductsToStorage(data);
  clearForm();
}

function gatherFormData() {
  const name = document.getElementById('name').value
  const price = document.getElementById('price').value
  const category = document.getElementById('category').value
  const image = document.getElementById('image').value
  const id = Date.now() // an id that is based on the time of creation. a user can't create the same id because the form is cleared once submitted
  console.log(id)
  return { name, price, category, image, id }
}

function createLine(data) {
  const newLine = `
     <tr id="${data.id}">
        <td>${data.name}</td>
        <td>${data.price}₪</td>
        <td>${data.category}</td>
        <td><img src=${data.image}> </td>
        <td><button onclick="deleteProduct(${data.id})" class="delete-btn">Delete</button></td>
    </tr>
 
 `
  return newLine
}

function deleteProduct(id) {
  document.getElementById(id).innerHTML = '';

  const productsJSON = localStorage.getItem('products');
  const products = JSON.parse(productsJSON);
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      products.splice(i, 1);

    }
  }
  localStorage.setItem('products', JSON.stringify(products));
}


function deleteAll() {
  if (confirm("Press OK to delete all the products from the cart.")) {
    localStorage.removeItem('products');
    document.getElementById('shopping-cart').innerHTML = '';
  }
}


function injectLineIntoDOM(newLine) {
  document.getElementById('shopping-cart').innerHTML += newLine;
}

// why is loadProductsFromStorage() function is inefficient?

// because of what we declare in the for loop. each time we call createLine inside the loop, we also 
// need to call the injectLineIntoDOM function. meaning - we are making the DOM re-render over and over.
// that wastes time and resources.
// best to just create a HTML string that contains all of the rows, and update the DOM just once.

// here lies the old function -

// function loadProductsFromStorage() {
//   const productsJSON = localStorage.getItem('products');
//   if (productsJSON) {
//     const products = JSON.parse(productsJSON);
//     for (const product of products) {
//       const newLine = createLine(product);
//       injectLineIntoDOM(newLine);
//     }
//   }
// }

//and here is a better approach - 
function betterApproachOnLoadProductsFromStorage() {
  const productsJSON = localStorage.getItem('products');
  if (productsJSON) {
    const products = JSON.parse(productsJSON);
    let allRows = '';
    for (const product of products) {
      allRows += createLine(product);
    }

    injectLineIntoDOM(allRows);
  }
}

function saveProductsToStorage(product) {
  const productsJSON = localStorage.getItem('products') || "[]";
  const products = JSON.parse(productsJSON);
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
}

function clearForm() {
  document.getElementById("shopping-form").reset();
}

betterApproachOnLoadProductsFromStorage();