const allRocketsUrl = "https://api.spacexdata.com/v4/rockets";
const wikiUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const rocketsList = document.getElementById("rockets");
const btn = document.querySelector("button");

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
function fetchData(url) {
  return fetch(url)
          .then(checkStatus)
          .then(res => res.json())
          .catch(error => console.error('Looks like there was a problem:', error))
}

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
// Get the JSON from the SpaceX and Wikipedia APIs
function getRockets() {
  const rocketsJSON = fetchData(allRocketsUrl);
  const rockets = rocketsJSON.map((rocket) => {
    const name = rocket.name;
    const img = rocket.flickr_images[0];
    const url = rocket.wikipedia;
    const descriptionJSON = fetchData(wikiUrl + name);
    return { ...descriptionJSON, name, img, url };
  });
  return Promise.all(rockets);
}


function checkStatus(response) {
  if(response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function generateHTML(data) {
  data.map((rocket) => {
    const section = document.createElement("section");
    rocketsList.appendChild(section);
    section.innerHTML = `
      <h2>${rocket.name}</h2>
      <img src=${rocket.img}>
      <p>${rocket.description}</p>
      <a href=${rocket.url}>Read more on Wikipedia</a>
    `;
  });
}

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------
btn.addEventListener("click", async (event) => {
  event.target.textContent = "Loading...";

  fetchData(getRockets)
    .then(generateHTML)
    .finally(() => event.target.remove());
});
