$(function () { 
  $("#navbarToggle").blur(function (event) {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

const dc = {};

const homeHtmlUrl = "snippets/home-snippet.html";
const allCategoriesUrl =
  "https://davids-restaurant.herokuapp.com/categories.json";
const categoriesTitleHtml = "snippets/categories-title-snippet.html";
const categoryHtml = "snippets/category-snippet.html";
const menuItemsUrl =
  "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
const menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

const insertHtml = function (selector, html) {
  const targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};


const showLoading = function (selector) {
  const html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};


const insertProperty = function (string, propName, propValue) {
  const propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};


const switchMenuToActive = function ()
  va classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;


  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};
document.addEventListener("DOMContentLoaded", function (event) {


showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  allCategoriesUrl,
  buildAndShowHomeHTML, 
  true); 
});
function buildAndShowHomeHTML (categories) {

  
  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      var chosenCategoryShortName = chooseRandomCategory(categories).short_name;


     
      chosenCategoryShortName = "'" + chosenCategoryShortName + "'";
      const homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, "randomCategoryShortName", chosenCategoryShortName);

    
  
      insertHtml('#main-content', homeHtmlToInsertIntoMainPage);

    },
    false);
}


function chooseRandomCategory (categories) {

  const randomArrayIndex = Math.floor(Math.random() * categories.length);

  return categories[randomArrayIndex];
}

dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};


dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort,
    buildAndShowMenuItemsHTML);
};



function buildAndShowCategoriesHTML (categories) {

  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
          switchMenuToActive();

          var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}


function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {

  const finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";


  for (const i = 0; i < categories.length; i++) {
    const html = categoryHtml;
    const name = "" + categories[i].name;
    const short_name = categories[i].short_name;
    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html,
                     "short_name",
                     short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}




function buildAndShowMenuItemsHTML (categoryMenuItems) {

  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          
          switchMenuToActive();

          const menuItemsViewHtml =
            buildMenuItemsViewHtml(categoryMenuItems,
                                   menuItemsTitleHtml,
                                   menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);
}



function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml) {

  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.category.name);
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);

  const finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";


  const menuItems = categoryMenuItems.menu_items;
  const catShortName = categoryMenuItems.category.short_name;
  for (const i = 0; i < menuItems.length; i++) {
   
    const html = menuItemHtml;
    html =
      insertProperty(html, "short_name", menuItems[i].short_name);
    html =
      insertProperty(html,
                     "catShortName",
                     catShortName);
    html =
      insertItemPrice(html,
                      "price_small",
                      menuItems[i].price_small);
    html =
      insertItemPortionName(html,
                            "small_portion_name",
                            menuItems[i].small_portion_name);
    html =
      insertItemPrice(html,
                      "price_large",
                      menuItems[i].price_large);
    html =
      insertItemPortionName(html,
                            "large_portion_name",
                            menuItems[i].large_portion_name);
    html =
      insertProperty(html,
                     "name",
                     menuItems[i].name);
    html =
      insertProperty(html,
                     "description",
                     menuItems[i].description);

  
    if (i % 2 !== 0) {
      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}
function insertItemPrice(html,
                         pricePropName,
                         priceValue) {
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}


function insertItemPortionName(html,
                               portionPropName,
                               portionValue) 
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}


global.$dc = dc;

})(window);