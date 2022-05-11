    /* 음악 기록*/
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
                    let url = rows[i]['url']
                    let artist = rows[i]['artist']
                    let num = rows[i]['num']
                    let done = rows[i]['done']

                    let temp_html = ``

                    if ( done == 0){
                        temp_html = ` <div class="col">
                                            <div class="card">
                                                 <a href="${url}"><img src=${image}
                                                  class="card-img-top"></a>
                                              <div class="card-body">
                                                    <h5 class="card-title">${title}</h5>                
                                                    <p class="card-text">${artist}</p> 
                                                </div>
                                                <div class="card-detail">
                                                     <i class="far fa-comment"></i>
                                                     <p class="card-text">${comment}</p>
                                                 </div> 
                                                 <div class="heart">                         
                                                    <span class="material-icons-outlined">favorite_border</span>
                                                </div>
                                                <button onclick="done_music(${num})" type="button" class="btn btn-outline-primary">삭제</button>
                                              
                                        </div>`
                    } else if ( done == 1){
                        temp_html = ` `
                    } else {
                        temp_html = ` <div class="col">
                                            <div class="card">
                                                 <a href="${url}"><img src=${image}
                                                  class="card-img-top"></a>
                                              <div class="card-body">
                                                    <h5 class="card-title">${title}</h5>
                                                    <p class="card-text">${artist}</p>
                                                </div>
                                                <div class="card-detail">
                                                     <i class="far fa-comment"></i>
                                                     <p class="card-text">${comment}</p>
                                                 </div>
                                                 <div class="heart">
                                                    <span class="material-icons-outlined">favorite_border</span>
                                                </div>

                                        </div>`
                    }


                    $('#cards-box').append(temp_html)

                }
            }
        })
    }
// 모달창 여는 함수//
// onclick='$("#modal-post").addClass("is-active")'

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
// 게시글 삭제
    function done_music(num){
            $.ajax({
                type: "POST",
                url: "/music/done",
                data: {num_give:num},
                success: function (response) {
                    alert(response["msg"])
                    window.location.reload()
                }
            });
        }

    /* 검색 */
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
