const allRocketsUrl = "https://api.spacexdata.com/v4/rockets";
const wikiUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const rocketsList = document.getElementById("rockets");
const btn = document.querySelector("button");

// Handle all fetch requests
async function getJSON(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Get the JSON from the SpaceX and Wikipedia APIs
async function getRockets(url) {
  const rocketsJSON = await getJSON(url);
  const rockets = rocketsJSON.map(async (rocket) => {
    const name = rocket.name;
    const img = rocket.flickr_images[0];
    const url = rocket.wikipedia;
    const descriptionJSON = await getJSON(wikiUrl + name);
    return { ...descriptionJSON, name, img, url };
  });
  return Promise.all(rockets);
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

btn.addEventListener("click", async (event) => {
  event.target.textContent = "Loading...";

  getRockets(allRocketsUrl)
    .then(generateHTML)
    .catch((e) => {
      rocketsList.innerHTML = "<h3>Something went wrong!</h3>";
      console.error(e);
    })
    .finally(() => event.target.remove());
});
