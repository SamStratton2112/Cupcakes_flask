const BASE_URL = "http://127.0.0.1:5000/api"


function createCupcakeLi(newCupcakeRes){
    return `
    <li data-id="${newCupcakeRes.id}">${newCupcakeRes.flavor}, ${newCupcakeRes.size}, ${newCupcakeRes.rating}
    <button class="delete-cupcake">Remove</button>
    <li>
    <img class="cupcake-image" src="${newCupcakeRes.image}" alt="no cupcake image">
    `;
}

async function showCupcakeList() {
    const res = await axios.get(`${BASE_URL}/cupcakes`);
    for(let cupcake of res.data.cupcakes){
        let newCupcake = $(createCupcakeLi(cupcake));
        $(".cupcake_list").append(newCupcake);
}}


$(".new-cupcake-form").on("submit", async function (evt) {
    evt.preventDefault();

    let flavor = $('#flavor').val();
    let rating = $("#rating").val();
    let size = $("#size").val();
    let image = $("#image").val();
    let id = $(this).data('id')

    const newCupcakeRes = await axios.post(`${BASE_URL}/cupcakes`, {
        flavor,
        rating,
        size,
        image,
        id
      });

    let newCupcake = newCupcakeRes.data.cupcake;
    $(".cupcake_list").append(newCupcake);
    $(".new-cupcake-form").trigger("reset");
})

// (createCupcakeLi(newCupcakeRes.data.cupcake))

$('.cupcake_list').on('click', '.delete-cupcake', async function(evt){
    evt.preventDefault();
    let $cupcake=$(evt.target).closest('li');
    let cupcakeId=$cupcake.attr('data-id');
    await axios.delete(`${BASE_URL}/cupcakes/${cupcakeId}`,{mode:'cors'});
})

$(showCupcakeList)

async function deleteCupcake() {
    const id = $(this).data('id')
    await axios.delete(`${BASE_URL}/cupcakes/${id}`)
    $(this).parent().remove()
    // evt.preventDefault();
    // let $cupcake = $(evt.target).closest("li");
    // let cupcakeId = $cupcake.attr("data-id");
  
    // await axios.delete(`${BASE_URL}/cupcakes/${cupcakeId}`);
    // $cupcake.parent().remove();
  };

  $('.delete-cupcake').click(deleteCupcake)
