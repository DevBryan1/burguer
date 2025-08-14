 let botao = document.querySelector(".menu-icon");
 let menuMobile = document.querySelector(".menu-mobile");
 
    botao.addEventListener("click", function (){
        if(menuMobile.style.display == 'flex'){
            menuMobile.style.display = 'none';
        } else {
            menuMobile.style.display = 'flex';
        }
});

const searchInput = document.querySelector(".search input");
const categorySelect = document.querySelector(".search select");
const products = document.querySelectorAll(".product-item");

function filtrarProdutos() {
    const termoBusca = searchInput.value.toLowerCase();
    const categoriaSelecionada = categorySelect.value.toLowerCase();
    const texto = document.querySelector(".notFound");
    let encontrados = 0; 

    products.forEach(produto => {
        const nome = produto.getAttribute('data-name').toLowerCase();
        const categoria = produto.getAttribute('data-category').toLowerCase();

        const bateBusca = nome.includes(termoBusca);
        const bateCategoria = categoriaSelecionada === '' || categoria === categoriaSelecionada;

        if (bateBusca && bateCategoria) {
            produto.style.display = '';
            encontrados++; 
        } else {
            produto.style.display = 'none';
        }
    });

    if (encontrados === 0) {
        texto.innerHTML = "<h1 style='text-align:center;'>Não encontramos o produto!</h1>";
    } else {
        texto.innerHTML = ""; 
    }
}

searchInput.addEventListener('input', filtrarProdutos);
categorySelect.addEventListener('change', filtrarProdutos);
