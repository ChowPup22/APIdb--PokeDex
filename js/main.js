const active = 'active';
let pokeArray = [];
let pokeDexArr = [];


const addFavArray = (card) => {
  for (let i = 0; i < pokeArray.length; i ++) {
    if (pokeArray[i].Name === card.dataset.order) {
      pokeDexArr.push(pokeArray[i]);
      pokeArray.splice(i, 1);

    }
  }
  console.log(pokeArray);
}

const remFavArray = (card) => {
  for ( let i = 0; i < pokeDexArr.length; i ++) {
    if (pokeDexArr[i].Name === card.dataset.order) {
      pokeArray.push(pokeDexArr[i]);
      pokeDexArr.splice(i, 1);
      
    }
  }
  console.log(pokeDexArr);
}

newPokeCard = (res) => {
  res.forEach(obj => {
    const tree = document.createDocumentFragment();
    const cardWrap = document.createElement('div');
    cardWrap.classList.add('poke-card');
    cardWrap.dataset.order = obj.Name;
    const fav = document.createElement('i');
    fav.classList.add('fa-solid');
    fav.classList.add('fa-heart');
    cardWrap.appendChild(fav);
    const body = document.createElement('div');
    body.classList.add('card-body');
    cardWrap.appendChild(body);
    const icon = document.createElement('img');
    icon.setAttribute('src', obj.Picture);
    icon.setAttribute('alt', 'Pokemon Image');
    body.appendChild(icon);
    const popUp = document.createElement('div');
    popUp.classList.add('card-popup-box');
    body.appendChild(popUp);
    const title = document.createElement('h3');
    title.appendChild(document.createTextNode(obj.Name));
    popUp.appendChild(title);
    const type = document.createElement('div');
    type.appendChild(document.createTextNode(`Type: ${obj.Type}`));
    popUp.appendChild(type);
    const ability = document.createElement('div');
    ability.appendChild(document.createTextNode(`Ability: ${obj.Ability}`));
    popUp.appendChild(ability);
    tree.appendChild(cardWrap);
    document.getElementById('poke-grid').appendChild(tree);

  })
  const isFav = document.querySelectorAll('.poke-card');
    
  const setFav = (card) => {
    if(!card.currentTarget.classList.contains(active)) {
      card.currentTarget.classList.add(active);
      addFavArray(card.currentTarget);
      document.getElementById('pokedex').appendChild(card.currentTarget);
    } else {
      card.currentTarget.classList.remove(active)
      remFavArray(card.currentTarget);
      document.getElementById('poke-grid').appendChild(card.currentTarget);
    };
  }

  isFav.forEach(card => {
    card.addEventListener('click', setFav, false);
  })
}

const sorter = document.querySelectorAll('.sort-btn');


const setActive = (elm, selector) => {
  if (document.querySelector(`${selector}.${active}`) !== null) {
    document.querySelector(`${selector}.${active}`).classList.remove(active);
  };
  elm.classList.add(active);
}; 

const sortCards = (val) => {
  if (val === 'asc') {
    pokeArray[0].sort(function(a, b) {
      if (a.Name.toLowerCase() < b.Name.toLowerCase()
      ) return -1;
      if (a.Name.toLowerCase() > b.Name.toLowerCase()
      ) return 1;
      return 0;
    });
    console.log(pokeArray);
    console.log(pokeDexArr);
    document.getElementById('poke-grid').innerHTML = '';
    pokeArray.forEach((obj) => newPokeCard(obj));
  } else if (val === 'dec') {
    pokeArray[0].sort(function(a, b) {
      if (b.Name.toLowerCase() < a.Name.toLowerCase()
      ) return -1;
      if (b.Name.toLowerCase() > a.Name.toLowerCase()
      ) return 1;
      return 0;
    });
    console.log(pokeArray);
    console.log(pokeDexArr);
    document.getElementById('poke-grid').innerHTML = '';
    pokeArray.forEach((obj) => newPokeCard(obj));
  }
}

sorter.forEach(btn => {
  btn.addEventListener('click', function () {
    const sort = this.dataset.sorter;

    setActive(btn, '.sort-btn');
    sortCards(sort);
  });
})

const getData = () => {
  const promises = [];
  for (let i = 1; i <= 50; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url).then(res => res.json()));
  }

  Promise.all(promises).then(r => {
    const pokemon = r.map((r) => ({
      Name: r.name,
      Picture: r.sprites['front_default'],
      Type: r.types.map((type) => type.type.name).join(', '),
      Ability: r.abilities.map((ability) => ability.ability.name).join(', '),
    }));
    pokeArray.push(pokemon);
    newPokeCard(pokemon);
  })
  .catch(err => console.log('Fetch failed: ', err));
}

getData();

