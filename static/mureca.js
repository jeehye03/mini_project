    function listing() {
        $.ajax({
            type: 'GET',
            url: '/music',
            data: {},
            success: function (response) {
                let rows = response['musics']
                for (let i = 0; i < rows.length; i++) {
                    let title = rows[i]['title']
                    let image = rows[i]['image']
                    let comment = rows[i]['comment']

                    let temp_html = ` <div class="col">
                                            <div class="card">
                                              <a href=""><img src=${image}
                                              class="card-img-top"></a>
                                              <div class="card-body">
                                                <h6 class="card-title">${title}</h6>
                                                 <p class="card-text">${comment}</p>
                                                <span class="material-icons-outlined">favorite_border</span>
                                              </div>
                                        </div>`

                    $('#cards-box').append(temp_html)

                }
            }
        })
    }

    function posting() {
        let url = $('#url').val()
        let comment = $('#comment').val()
        $.ajax({
            type: 'POST',
            url: '/music',
            data: {url_give: url, comment_give: comment},
            success: function (response) {
                alert(response['msg'])
                window.location.reload()
            }
        });
    }

    function search() {
        $('#cards-box').empty()
        $.ajax({
            type: 'POST',
            url: '/search',
            data: {},
            success: function (response) {
                let rows = response['musics']
                for (let i = 0; i < rows.length; i++) {
                    let title = rows[i]['title']
                    let artist = rows[i]['artist']
                    let image = rows[i]['image']
                    let search = $('#search_input').val();
                    if (title.includes(search)) {

                        let temp_html = ` <div class="col">
                                            <div class="card">
                                              <img src=${image}
                                              class="card-img-top">
                                              <div class="card-body">
                                                <h5 class="card-title">${title}</h5>
                                                <p class="card-text">${artist}</p>
                                                <span class="material-icons-outlined">favorite_border</span>
                                              </div>
                                            </div>`
                        $('#cards-box').append(temp_html)
                    }

                }

            }
        })
    }



    function open_box() {
        $('#post-box').show()
    }

    function close_box() {
        $('#post-box').hide()
    }
