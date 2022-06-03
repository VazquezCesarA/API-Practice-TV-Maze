// "use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)===
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let responseApi = await axios.get(
    `http://api.tvmaze.com/search/shows?q=${term}`
  );
  // [0].show.image.original
  return responseApi.data;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    let temp = "";
    let tempSummary = "";

    if (show.show.image == null) {
      temp =
        "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300";
    } else {
      temp = show.show.image.original;
    }
    if (show.show.summary == null) {
      tempSummary = "No Data!";
    } else {
      tempSummary = show.show.summary;
    }
    const $show = $(
      `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${temp}" 
              alt="${show.show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${tempSummary}</small></div>
             <ul> </ul>
             <button data-show-id="${show.show.id}" class="btn btn-outline-light btn-sm Show-getEpisodes ">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);
  $episodesArea.hide();
  populateShows(shows);
  let episodeButton = document.getElementsByClassName(
    "btn btn-outline-light btn-sm Show-getEpisodes"
  );
  for (let btn of episodeButton) {
    let ul = document.querySelector("#episodes-list");
    btn.addEventListener("click", () => {
      ul.innerHTML = "";
      $episodesArea.show();
      searchForEpisodes(btn.getAttribute("data-show-id"));
    });
  }
}

async function searchForEpisodes(id) {
  const episodes = await getEpisodesOfShow(id);
  populateEpisodes(episodes);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  let responseApi = await axios.get(
    `http://api.tvmaze.com/shows/${id}/episodes`
  );
  return responseApi;
}
// episodesList.innerHTML += `<li>id: ${JSON.stringify(responseApi.data[x].id)} </li>`;

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  let episodesList = document.querySelector("#episodes-list");
  for (let x = 0; x < episodes.data.length; x++) {
    episodesList.innerHTML += `<li>${JSON.stringify(
      episodes.data[x].name
    )} ( season: ${JSON.stringify(
      episodes.data[x].season
    )}, number: ${JSON.stringify(episodes.data[x].number)}  )</li>`;
  }
}

// searchForEpisodes(582);

// {
//   id: 1767,
//   name: "The Bletchley Circle",
//   summary:
//     `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
//        women with extraordinary skills that helped to end World War II.</p>
//      <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
//        normal lives, modestly setting aside the part they played in
//        producing crucial intelligence, which helped the Allies to victory
//        and shortened the war. When Susan discovers a hidden code behind an
//        unsolved murder she is met by skepticism from the police. She
//        quickly realises she can only begin to crack the murders and bring
//        the culprit to justice with her former friends.</p>`,
//   image:
//       "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
// }
