let pageCount = 1;
let category = ''
$('.add-btn').on('click', function(e){
  let newCakes = {
    title: $('.title').val(),
    image: $('.image').val(),
    description: $('.description').val(),
    price: $('.price').val(),
  }

  fetch(`http://localhost:8003/${category}`,{
    method: 'POST',
    body: JSON.stringify(newCakes),
    headers:{
      'Content-type': 'application/json'
    }
  })
  .then(()=> render())
})
let searchValue = '';
    $('.search-inp').on('input', function(e){
        searchValue = e.target.value
        render()
    })

    render()
    function getPagination(){
        fetch('http://localhost:8001/todo')
        .then(res => res.json())
        .then(data => {
            pageCount = Math.ceil(data.length / 4)
            $('.pagination-page').remove()
            for(let i = pageCount; i >= 1; i--){
                $('.previous-btn').after(`<span class=" pagination-page">
            <button><a href="#" alt="...">${i}</a></button>
            </span>`)
        }
    })
    }
    $('body').on('click', '.pagination-page', function(event){
      page = event.target.innerText
      render()
  })
  render()

  $('.next-btn').on('click', function(){
    if(page>= pageCount)return
    page++
    render()
})
render()

$('.previous-btn').on('click', function(){
    if (page<=1) return
    page--
    render()
})
render()


function render(){
  fetch(`http://localhost:8003/${category}`) //?_page=${page}&_limit=4&q=${searchValue}
  .then(res => res.json())
  .then (data => {
    $('.cakes-block').html("")
    data.forEach(item => {
      $('.cakes-block').append(`
      <div class="card" style="width: 18rem;">
        <img class="card-img-top" src="${item.image}" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text">${item.description.slice(0, 100)}...</p>
          <p class="card-text">${item.price} сом за кг.</p>
          <button id="${item.id}" class="btn btn-edite">Редактировать</button>
          <a href="#" id="${item.id}" class="btn btn-delete">Удалить</a>
        </div>
      </div>`)

    });
  })
}
$('body').on('click', '.btn-delete', function () {
    let id = this.id
    fetch(`http://localhost:8003/${category}/${id}`, { method: "DELETE" })
        .then(() => render())
})

$('body').on('click', '.btn-edite', function(e){
  let id = this.id
  fetch(`http://localhost:8003/${category}/${id}`)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    $('.title-edit').val(data.title)
    $('.image-edit').val(data.image)
    $('.description-edit').val(data.description)
    $('.price-edit').val(data.price)
    $('.main-modal').css('display', 'block')
    $('.btn-save').attr('id', id)
  })
})

$('.btn-save').on('click', function(){
  let newCakes = {
    title: $('.title-edit').val(),
    image:$('.image-edit').val(),
    description: $('.description-edit').val(),
    price: $('.price-edit').val(),
  }

  fetch(`  http://localhost:8003/${category}/${this.id}`, {
    method: 'PATCH',
    body: JSON.stringify(newCakes),
    headers:{
      'Content-type': 'application/json'
    }
  })
  .then(()=>{
    $('.main-modal').css('display', 'none')
    render()
  })
})


$('.category').on("click", function(e){
  console.log(e.target.id);
  category = e.target.id;
  render()
})