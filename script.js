let showSeconds = false;

function initSetting() {
  if (localStorage.getItem("showClock24") === null) {
    localStorage.setItem("showClock24", true);
  }

  if (localStorage.getItem("showSec") === null) {
    localStorage.setItem("showSec", false);
  }

  if (localStorage.getItem("showDate") === null) {
    localStorage.setItem("showDate", false);
  }
}
function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

function displayClock(){
  const current = new Date();
  let h = current.getHours();
  let m = current.getMinutes();
  let s = current.getSeconds();
  let ampm = "";
  if(localStorage.getItem("showClock24") === "false"){
    ampm = h >= 12 ? " PM" : " AM";
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
  }
  m = checkTime(m);
  s = checkTime(s);
  if(localStorage.getItem("showSec") === "true"){
    document.getElementById("time").innerHTML =  h + ":" + m + ":" + s + ampm;
  }else{
    document.getElementById("time").innerHTML =  h + ":" + m + ampm;
  }
  setTimeout(displayClock, 1000);
}

function showDate(date) {
  if (localStorage.getItem("showDate") === "true") {
    document.getElementById("date").innerHTML = date;
  } else {
    document.getElementById("date").innerHTML = "";
  }
}

function init() {
  initSetting();

  // call api
  fetch(
    "https://api.nasa.gov/planetary/apod?api_key=ZocZplb2qxOGQcHw0WL4W8MhKdvpVYZDYp4YhE58"
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);

      const moreModal = document.getElementById("more-modal");
      const chkClock24 = document.getElementById("chk-clock24");
      const chkSec = document.getElementById("chk-seconds");
      const chkDate = document.getElementById("chk-date");

      if (localStorage.getItem("showClock24") === "true") {chkClock24.checked =true;}
      if (localStorage.getItem("showSec") === "true") {chkSec.checked =true;}
      if (localStorage.getItem("showDate") === "true") {chkDate.checked =true;}

      // set backgroun image
      document.body.style.backgroundImage = "url('" + data.hdurl + "')";
      //set title
      document.getElementById("title").innerHTML = data.title;
      // set description of image
      document.getElementById("explanation").innerHTML = data.explanation;

      showDate(data.date);

      // set more data
      const moreDate = new Date(data.date);
      // console.log(moreDate);

      document.getElementById("dow").innerHTML =
        "Day OF THE WEEK: <span>" +
        moreDate.toLocaleString("en-us", { weekday: "long" }) +
        "</span>";

      document.getElementById("dom").innerHTML =
        "Day OF THE MONTH: <span>" + moreDate.getDate() + "</span>";

      document.getElementById("doy").innerHTML =
        "Day OF THE YEAR: <span>" +
        Math.floor(
          (moreDate - new Date(moreDate.getFullYear(), 0, 0)) /
            1000 /
            60 /
            60 /
            24
        ) +
        "</span>";

      document.getElementById("woy").innerHTML =
        "WEEK OF THE YEAR: <span>" +
        Math.floor(
          (moreDate - new Date(moreDate.getFullYear(), 0, 0)) /
            1000 /
            60 /
            60 /
            24 /
            7
        ) +
        "</span>";

      // setting button handler
      const btnSetting = document.getElementById("setting-btn");
      btnSetting.addEventListener("click", function () {
        const settingBox = document.getElementById("setting-box");
        if (settingBox.style.display === "none") {
          settingBox.style.display = "block";
        } else {
          settingBox.style.display = "none";
        }
      });

      //more button handler
      const btnMore = document.getElementById("more-btn");
      btnMore.addEventListener("click", function () {
        moreModal.style.display = "block";
      });

      // close modal
      const btnCloseModal = document.getElementById("modal-close");
      btnCloseModal.addEventListener("click", function () {
        moreModal.style.display = "none";
      });

      // check boxes setting handler
      chkClock24.addEventListener("change", function () {
        localStorage.setItem("showClock24", chkClock24.checked);
      });
      chkSec.addEventListener("change", function () {
        localStorage.setItem("showSec", chkSec.checked);
      });
      chkDate.addEventListener("change", function () {
        localStorage.setItem("showDate", chkDate.checked);
        showDate(data.date);
      });

      displayClock();
    });
}
