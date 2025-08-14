// MENU MOBILE
const botaoMenu = document.querySelector(".menu-icon");
const menusMobile = document.querySelectorAll(".menu-mobile");

botaoMenu.addEventListener("click", () => {
    menusMobile.forEach(menu => menu.classList.toggle("active"));
});

// FILTRAR PRODUTOS
const searchInput = document.querySelector(".search input");
const categorySelect = document.querySelector(".search select");
const notFoundText = document.querySelector(".notFound");

function filtrarProdutos() {
    const termoBusca = searchInput.value.toLowerCase();
    const categoriaSelecionada = categorySelect.value.toLowerCase();
    let encontrados = 0;

    products.forEach(produto => {
        const nome = produto.getAttribute('data-name').toLowerCase();
        const categoria = produto.getAttribute('data-category').toLowerCase();

        const bateBusca = nome.includes(termoBusca);
        const bateCategoria = categoriaSelecionada === '' || categoria === categoriaSelecionada;

        if(bateBusca && bateCategoria) {
            produto.style.display = '';
            encontrados++;
        } else {
            produto.style.display = 'none';
        }
    });

    notFoundText.innerHTML = encontrados === 0 ? "<h1 style='text-align:center;'>Não encontramos o produto!</h1>" : "";
}
searchInput.addEventListener('input', filtrarProdutos);
categorySelect.addEventListener('change', filtrarProdutos);



//CARRINHO
// ========================
// VARIÁVEIS E SELETORES
// ========================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.querySelectorAll("#cart-count");
const cartTotal = document.querySelectorAll("#cart-total");
const cartItemsContainers = document.querySelectorAll(".cart-items");
const products = document.querySelectorAll(".product-item");

const cartIcons = document.querySelectorAll(".cart-icon");

// ========================
// FUNÇÃO: SALVAR NO LOCALSTORAGE
// ========================
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ========================
// FUNÇÃO: FORMATAR PREÇO
// ========================
function formatPrice(value) {
    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        style: "currency",
        currency: "BRL"
    });
}

// ========================
// FUNÇÃO: ATUALIZAR CARRINHO NA TELA
// ========================
function updateCartDisplay() {
    cartItemsContainers.forEach((cartItemsContainer, index) => {
        cartItemsContainer.innerHTML = "";
        let total = 0;
        let totalItems = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            totalItems += item.quantity;

            // Elemento <li>
            const li = document.createElement("li");
            li.classList.add("cart-item");

            // Imagem
            const img = document.createElement("img");
            img.src = item.img;
            img.alt = item.name;
            img.classList.add("cart-item-img");

            // Info
            const infoDiv = document.createElement("div");
            infoDiv.classList.add("cart-item-info");
            infoDiv.innerHTML = `
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            `;

            // Controles de quantidade
            const qtyControls = document.createElement("div");
            qtyControls.classList.add("cart-item-controls");
            qtyControls.innerHTML = `
                <button class="qty-btn decrease" data-name="${item.name}">−</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button class="qty-btn increase" data-name="${item.name}">+</button>
            `;

            // Botão remover
            const removeBtn = document.createElement("button");
            removeBtn.classList.add("remove-btn");
            removeBtn.dataset.name = item.name;
            removeBtn.textContent = "❌";

            // Monta o li
            li.appendChild(img);
            li.appendChild(infoDiv);
            li.appendChild(qtyControls);
            li.appendChild(removeBtn);

            cartItemsContainer.appendChild(li);
        });

        // Atualiza contadores e total
        cartCount[index].textContent = totalItems;
        cartTotal[index].textContent = total.toFixed(2).replace(".", ",");
    });

    saveCart();
}

// ========================
// FUNÇÃO: ADICIONAR ITEM
// ========================
function addToCart(name, price, img) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, img, quantity: 1 });
    }

    updateCartDisplay();
    alert("Pedido adicionado ao carrinho!");
}

// ========================
// FUNÇÃO: REMOVER ITEM
// ========================
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartDisplay();
}

// ========================
// FUNÇÃO: ALTERAR QUANTIDADE
// ========================
function changeQuantity(name, delta) {
    const item = cart.find(i => i.name === name);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(name);
    } else {
        updateCartDisplay();
    }
}

// ========================
// EVENTOS: CLIQUE EM PRODUTOS
// ========================
products.forEach(product => {
    product.addEventListener("click", (e) => {
        e.preventDefault();

        const name = product.dataset.name;
        const priceText = product.querySelector(".product-price")
            .textContent.replace("R$", "").replace(",", ".");
        const price = parseFloat(priceText);

        // Pega a imagem dentro da .photo
        const img = product.querySelector(".photo img").src;

        addToCart(name, price, img);
    });
});

// ========================
// EVENTOS: CLIQUES NO CARRINHO
// ========================
cartItemsContainers.forEach(cartItemsContainer => {
    cartItemsContainer.addEventListener("click", (e) => {
        const name = e.target.dataset.name;

        if (e.target.classList.contains("remove-btn")) {
            removeFromCart(name);
        }

        if (e.target.classList.contains("increase")) {
            changeQuantity(name, 1);
        }

        if (e.target.classList.contains("decrease")) {
            changeQuantity(name, -1);
        }
    });
});

// ========================
// EVENTO: ABRIR/FECHAR CARRINHO
// ========================
cartIcons.forEach(icon => {
    icon.addEventListener("click", (e) => {
        e.stopPropagation();
        const dropdown = icon.querySelector(".cart-dropdown");
        dropdown.classList.toggle("show");
    });
});

// Fechar todos os dropdowns se clicar fora
document.addEventListener("click", () => {
    document.querySelectorAll(".cart-dropdown").forEach(dropdown => {
        dropdown.classList.remove("show");
    });
});

const checkoutBtn = document.querySelectorAll("#checkout-btn");

checkoutBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        if(cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        // Monta a mensagem
        let message = "Olá! Gostaria de fazer o pedido:\n\n";
        cart.forEach(item => {
            message += `${item.name} - Quantidade: ${item.quantity} - Preço unitário: ${formatPrice(item.price)}\n\n`;
        });

        let total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        message += `\nTotal: ${formatPrice(total)}`;

        // Codifica para URL
        const encodedMessage = encodeURIComponent(message);

        // Número do WhatsApp (substitua pelo seu)
        const phone = "5551996927651";

        // Abre o WhatsApp
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
    });
});

// ========================
// INICIALIZAÇÃO
// ========================
updateCartDisplay();