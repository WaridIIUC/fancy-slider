const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const warningMessage = document.getElementById("warning-h1");
const totalImages = document.getElementById("total-images-p");
const totalSelectedImages = document.getElementById("total-selected-images-p");
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  if(images.length != 0){   
    console.log();                              // check images array is empty or not
    imagesArea.style.display = 'block';                   // if not empty add & display images
    gallery.innerHTML = '';                               // clear previous load data
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = `<img class="img-fluid img-thumbnail image" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}" >
                      <p class="image-title">Category: ${image.tags}</p>`;
      gallery.appendChild(div);
      warningMessage.innerText = "";                      // clear previous warning message 
      totalImages.innerText = images.length;
    })
  }
  else{                                                   // if images array is empty
    imagesArea.style.display = 'none';                    // previous display images div make display none
    warningMessage.innerText = "Nothing Found on your search result";         // display warning message that about search input
  }
  toggleSpinner();                                        // spinner function call after data load from api (for close spinner)
}

const getImages = (query) => {              
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => {
      showImages(data.hits);
    })
    .catch(err => {
      alert("Not found");                                 // if any error ocurred when loading data
    })
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');                         //select specific image
  let item = sliders.indexOf(img);                        // get img index on a array
  if (item === -1) {
    sliders.push(img);                                    // push image to slider
    totalSelectedImages.innerText = parseInt(totalSelectedImages.innerText) + 1;
  } else {                                                // for pop image
    element.classList.remove('added');                    // deselect image
    sliders = sliders.filter(img => img != sliders[item]);    // filter specific images from sliders array using index number
    totalSelectedImages.innerText = parseInt(totalSelectedImages.innerText) - 1;
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  let duration = document.getElementById('duration').value || 1000;
  if(duration < 0){               // if duration is negative input, then the initial value of duration will be 1s or 1000ms
    duration = 1000;
  }
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `
      <img class="w-100"
      src="${slide}"
      alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  if(search.value != ""){             // check if search input is empty or not
    toggleSpinner();                  // spinner function call when start data load from api (for start spinner)
    getImages(search.value)
    sliders.length = 0;
  }
  else{
    imagesArea.style.display = 'none';          // clear previous load images area by display none
    warningMessage.innerText = "Please write somethings on Search";         // display warning if search input is empty
  }
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

const searchInput = document.getElementById("search");

searchInput.addEventListener("keypress", function(event) {
    if (event.key == "Enter"){
      searchBtn.click();
      searchBtn.focus();
    }
});

const toggleSpinner = () => {                       // function for toggle spinner
  const spinner = document.getElementById("loading-spinner");       // get spinner div from html page where it display
  spinner.classList.toggle("d-none");               // d-none class toggle for display / close spinners
}
