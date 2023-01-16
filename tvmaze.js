const MISSING_IMAGE_URL = "https://tinyurl.com/tv-missing";
const $showsList = $("#shows-list");
const $searchForm = $("#search-form");
const $episodesArea = $("#episodes-area");
const $episodesList = $("#episodes-list");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function searchShows(showname) {
  let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${showname}`);

  let shows = res.data.map((result) => {
    let show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL,
    };
  });

  return shows;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    let $show = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
           <div class="card" data-show-id="${show.id}">
             <img class="card-img-top" src="${show.image}">
             <div class="card-body">
               <h5 class="card-title">${show.name}</h5>
               <p class="card-text">${show.summary}</p>
               <button class="btn btn-primary get-episodes">Show Episodes</button>
             </div>
           </div>  
         </div>
        `
    );

    $showsList.append($show);
  }
}

$searchForm.on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $episodesArea.hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

// async function searchForShowAndDisplay() {
//   const term = $("#searchForm-term").val();
//   const shows = await getShowsByTerm(term);

//   $episodesArea.hide();
//   populateShows(shows);
// }

// $searchForm.on("submit", async function (evt) {
//   evt.preventDefault();
//   await searchForShowAndDisplay();
// });

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  //create list of episodes
  for (let episode of episodes) {
    let $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `
    );

    $episodesList.append($item);
  }

  $episodesArea.show();
}

$showsList.on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
  console.log(episodes);
});

async function getEpisodes(id) {
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = res.data.map((episode) => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

  return episodes;
}
// $("#search-form").on("submit", async function handleSearch(evt) {
//   evt.preventDefault();

//   let query = $("#search-query").val();
//   if (!query) return;

//   $("#episodes-area").hide();

//   let shows = await searchShows(query);

//   populateShows(shows);
// });
