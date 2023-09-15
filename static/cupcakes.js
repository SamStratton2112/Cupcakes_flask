const BASE_URL = "http://localhost:5000/api"


function createCupcakeLi(cupcake){
    return `
    <li data-id="${cupcake.id}">${cupcake.flavor}, ${cupcake.size}, ${cupcake.rating}
    <button class="delete-cupcake">Remove</button>
    <li>
    <img class="cupcake-image" src="${cupcake.image}" alt="no cupcake image">
    `;
}

async function showCupcakeList() {
    const res = await axios.get(`${BASE_URL}/cupcakes`,{
        headers: {
            'Content-Type': 'application/json'
        }
    });
    for(let cupcake of res.data.cupcakes){
        let newCupcake = $(createCupcakeLi(cupcake));
        $(".cupcake_list").append(newCupcake);
    }
}

$(".new-cupcake-form").on("submit", async function (evt) {
    evt.preventDefault();

    let flavor = $('#flavor').val();
    let rating = $("#rating").val();
    let size = $("#size").val();
    let image = $("#image").val();

    const newCupcakeRes = await axios.post(`${BASE_URL}/cupcakes`, {
        flavor,
        rating,
        size,
        image
      });

    let newCupcake = (createCupcakeLi(newCupcakeRes.data.cupcake));
    $(".cupcake_list").append(newCupcake);
    $(".new-cupcake-form").trigger("reset");
})

$('.cupcake_list').on('click', '.delete-cupcake', async function(evt){
    evt.preventDefault();
    let $cupcake=$(evt.target).closest('li');
    let cupcakeId=$cupcake.attr('data-id');
    await axios.delete(`${BASE_URL}/cupcakes/${cupcakeId}`);
})

$(showCupcakeList)
