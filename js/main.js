/*** Object Constructors ***/
function ChaisChoice (product, size, color, quantity, pic, price){
    this.brand = "Chai's Choice";
    this.product = product;
    this.size = size;
    this.color = color;
    this.quantity = quantity;
    this.pic = pic;
    this.price = price;
}

/*** Global Variables ***/
var sizes = ["Tiny", "Small", "Medium", "Large"];
var color = ["Strawberry", "Blackberry", "Crazyberry", "Camouflage", "Night Moon", "Fire Orange"];
var shopping_cart = [];
/*record product, color, size selected*/
var sc_pcz_pair = [];
var num_of_sc_items = 0;
var sc_total_price = 0;

/*** Global Functions ***/

/* check if two arrays contain the same elements */
function sameArray(a, b){
    if(a.length != b.length){
        return false;
    } else if (a === b) {
        return true;
    } else {
        for (var i = 0; i<a.length; i ++){
            if (a[i] != b[i]){
                return false;
            }
        }
        return true;
    }
}

/* if there are items in the shopping cart, show the number of items above shopping cart */
function showItemNumber(){
    if (num_of_sc_items > 0){
        document.getElementById("item-number").innerHTML = num_of_sc_items;
        $("#cart-number-container").css("visibility", "visible");
    } else {
        $("#cart-number-container").css("visibility", "hidden");
    }
}

/* find which page the user is browsing */
function findFileName(){
    var href = document.location.href;
    var lastPathSegment = href.substr(href.lastIndexOf('/') + 1);
    return lastPathSegment;

}

/*Update order summary on the shopping cart page */
function updateOrderSummary(subtotal){
    $("#st-number").html("$" + subtotal.toFixed(2));
    var est_total = subtotal+3;
    $("#est-total").html("$" + est_total.toFixed(2));
}

/* Displauy first item in the shopping cart */
function showItem(index){
    var item = shopping_cart[index];
    $("#sc-pic-"+index).attr("src", item.pic);
    $("#sc-item-name-"+index).html(item.product);
    $("#sc-item-size-"+index).html(item.size);
    $("#sc-item-color-"+index).html(item.color);
    $("#sc-item-quantity-"+index).html(item.quantity);
    var item_total_price = item.price * item.quantity;
    sc_total_price = item_total_price;
    $("#sc-price-"+index).html("$"+ item_total_price.toFixed(2));
}

$(document).ready(function() {
    shopping_cart = JSON.parse(localStorage.getItem("saved-sc"));
    /* initial set-up */
    if (shopping_cart === null) {
        shopping_cart = [];
    } else {
        console.log(shopping_cart);
    };

    sc_pcz_pair = JSON.parse(localStorage.getItem("save-pc-pair"));
    if (sc_pcz_pair === null) {
        sc_pcz_pair = [];
    };

    num_of_sc_items = JSON.parse(localStorage.getItem("item-number"));
    if (num_of_sc_items === null) {
        num_of_sc_items = 0;
    } else {
        showItemNumber();
    }

    /* javascript on the shopping cart page */
    if (findFileName() === "shoppingcart.html"){
        /* display the items on the shopping cart page */
        if (num_of_sc_items === 0){
            console.log("0");
            $(".sc-item-container").css("visibility", "hidden");
        } else if (shopping_cart.length === 1) {
            showItem(0);
        } else {
            console.log("here");
            showItem(0);
            for (var i=1; i<shopping_cart.length; i ++){
                /*clone the original container, change element Ids and append to the bottom */
                var clone = $("#sc-item-container-0").clone();
                var newContainerId = "sc-item-container-" + i;
                var newPicId = "sc-pic-" + i;

                clone.attr("id", newContainerId);
                clone.find("#sc-pic-0").attr("id", newPicId);
                clone.find("#sc-item-name-0").attr("id", "sc-item-name-" + i);
                clone.find("#sc-item-size-0").attr("id", "sc-item-size-" + i);
                clone.find("#sc-item-color-0").attr("id", "sc-item-color-" + i);
                clone.find("#sc-item-quantity-0").attr("id", "sc-item-quantity-"+i);
                clone.find("#sc-price-0").attr("id", "sc-price-"+i);

                $(".sc-item-wrapper").append(clone);

                var item = shopping_cart[i];

                $("#" + newPicId).attr("src", item.pic);
                $("#sc-item-name-"+i).html(item.product);
                $("#sc-item-size-"+i).html(item.size);
                $("#sc-item-color-"+i).html(item.color);
                $("#sc-item-quantity-"+i).html(item.quantity);
                var item_total_price = item.price * item.quantity;
                sc_total_price += item_total_price;
                $("#sc-price-"+i).html("$"+ item_total_price.toFixed(2));
            }
        }
        updateOrderSummary(sc_total_price);

        /* remove items from shopping cart */
        $(".rm-bt").click(function(){
            var rm_item_index = $(this).parent().parent().index();
            var rm_item_product = shopping_cart[rm_item_index].product;
            var rm_item_color = shopping_cart[rm_item_index].color;
            var rm_item_size = shopping_cart[rm_item_index].size;
            var rm_item_quant = shopping_cart[rm_item_index].quantity;
            var rm_item_price = shopping_cart[rm_item_index].price;
            num_of_sc_items = num_of_sc_items - rm_item_quant;
            showItemNumber();

            /*change order summary in the shopping cart page */
            sc_total_price -= rm_item_quant*rm_item_price;
            updateOrderSummary(sc_total_price);

            /* remove the item from shopping cart array*/
            shopping_cart.splice(rm_item_index, 1);

            /*remove the item from the sc_pcz_pair array */
            for (var i = 0; i<sc_pcz_pair.length; i++){
                if (sameArray(sc_pcz_pair[i], [rm_item_product, rm_item_color, rm_item_size])){
                    sc_pcz_pair.splice(i, 1);
                }
            }

            $(this).parent().parent().remove();

            /*update local storage*/
            localStorage.setItem("saved-sc", JSON.stringify(shopping_cart));
            localStorage.setItem("save-pc-pair", JSON.stringify(sc_pcz_pair));
            localStorage.setItem("item-number", JSON.stringify(num_of_sc_items));
        })
    }

    var product_selection = document.getElementById("chai-p-name");
    var color_selection = document.getElementById("chai-color");
    var size_selection = document.getElementById("chai-size");
    var quantity_selection = document.getElementById("chai-quantity");
    var prod_img = document.getElementById("large-pic-chai");
    var price_selection = document.getElementById("chai-price");

    if (typeof(color_selection) != "undefined" && color_selection != null) {
    /* Change product pictures based on the color selected */
        color_selection.addEventListener("change", function(){
            var color_selected = color_selection.value;
            console.log(color_selected);
            if (color_selected === "Blackberry"){
                $("#large-pic-chai").attr("src", "images/Chai/Blackberry.jpg");
                $("#small-pic-chai").attr("src", "images/Chai/Blackberry.jpg");
            } else if (color_selected === "Camouflage"){
                $("#large-pic-chai").attr("src", "images/Chai/Camouflage.jpg");
                $("#small-pic-chai").attr("src", "images/Chai/Camouflage.jpg");
            } else if (color_selected === "Crazyberry"){
                $("#large-pic-chai").attr("src", "images/Chai/Crazyberry.jpg");
                $("#small-pic-chai").attr("src", "images/Chai/Crazyberry.jpg");
            } else if (color_selected === "Fire Orange") {
                $("#large-pic-chai").attr("src", "images/Chai/FireOrange.jpg");
                $("#small-pic-chai").attr("src", "images/Chai/FireOrange.jpg");
            } else if (color_selected === "Night Moon"){
                 $("#large-pic-chai").attr("src", "images/Chai/NightMoon.jpg");
                 $("#small-pic-chai").attr("src", "images/Chai/NightMoon.jpg");
            } else {
                $("#large-pic-chai").attr("src", "images/Chai/Strawberry.jpg");
                $("#small-pic-chai").attr("src", "images/Chai/Strawberry.jpg");
            };
        })
    }

    /* Add ietms to the shopping cart */
    var cart_add_bt = document.getElementById("sc-bt");
    if (typeof(cart_add_bt) != "undefined" && cart_add_bt != null){
        cart_add_bt.addEventListener("click", function(){
            var prod_selected = product_selection.innerHTML;
            var color_selected = color_selection.value;
            var size_selected = size_selection.value;
            var quant_selected = parseInt(quantity_selection.value);
            var img_src = prod_img.src;
            var price_selected = Number(price_selection.innerHTML.replace(/[^0-9\.-]+/g,""));
            /* Create new item to be added to teh array of shopping cart */
            var item_added = new ChaisChoice(prod_selected, size_selected, color_selected, quant_selected, img_src, price_selected);
            /* Update total number of items in the shopping cart */
            num_of_sc_items = num_of_sc_items + quant_selected;

            /* Check if the same product with the same color and size has been added to the shopping
            cart before. If so, only updates the quantity in the shopping cart. Otherwise,
            need to add a new item to the shopping cart. */
            var new_combo = [prod_selected, color_selected, size_selected];
            var comboAlreadyExist = false;
            for (var i = 0; i<sc_pcz_pair.length; i++){
                if (sameArray(sc_pcz_pair[i], new_combo)){
                    comboAlreadyExist = true;
                    for (i = 0; i < shopping_cart.length; i++){
                        var sc_item = shopping_cart[i];
                        if (sc_item.product === prod_selected && sc_item.color === color_selected && sc_item.size === size_selected){
                            shopping_cart[i].quantity = shopping_cart[i].quantity + quant_selected;
                        }
                    }
                }
            }

            if (comboAlreadyExist === false) {
                shopping_cart.push(item_added);
                sc_pcz_pair.push(new_combo);
            }

            /* if there are items in the shopping cart, show the number of items above shopping cart */
            showItemNumber();

            /* whenever the new items are added to the shopping cart, the local storage will update */
            localStorage.setItem("saved-sc", JSON.stringify(shopping_cart));
            localStorage.setItem("save-pc-pair", JSON.stringify(sc_pcz_pair));
            localStorage.setItem("item-number", JSON.stringify(num_of_sc_items));
        })
    }
})