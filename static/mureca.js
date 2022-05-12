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
                    let time = rows[i]['time']
                    let like = rows[i]['like']


                    let temp_html = `<div class="col">
                                            <div class="card">
                                                 <a href="${url}" target="_blank"><img src=${image}
                                                  class="card-img-top"></a>
                                                  <i class="fas fa-times delete" onclick="done_music(${num})"></i>
                                            
                                               <div class="card-body">
                                                    <h5 class="card-title">${title}</h5>                
                                                    <p class="card-text">${artist}</p> 
                                               </div>
                                               <div class="card-comment">
                                                     <i class="far fa-comment"></i>
                                                     <p class="card-text">${comment}</p>
                                               </div>
                                               <div class="card-date-like">
                                                    <div class="date">
                                                        <span>${time}</span>
                                                   </div>
                                                   <div class="like">
                                                        <span>❤️</span>                         
<!--                                                       <span class="material-icons-outlined">favorite_border</span>-->
                                                   </div>
                                               </div>
                                               
                                               
                                              </div>
                                        </div>`

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
                        let image = rows[i]['image']
                        let comment = rows[i]['comment']
                        let url = rows[i]['url']
                        let artist = rows[i]['artist']
                        let num = rows[i]['num']
                        let time = rows[i]['time']

                        let search = $('#search_input').val();
                        let cho1 = $('input:checkbox[name=cho1]').is(':checked');
                        let cho2 = $('input:checkbox[name=cho2]').is(':checked');
                        if(cho1 == true){
                        if(title.includes(search))
                        {
                            let temp_html = `<div class="col">
                                            <div class="card">
                                                 <a href="${url}" target="_blank"><img src=${image}
                                                  class="card-img-top"></a>
                                                  <i class="fas fa-times delete" onclick="done_music(${num})"></i>
                                            
                                               <div class="card-body">
                                                    <h5 class="card-title">${title}</h5>                
                                                    <p class="card-text">${artist}</p> 
                                               </div>
                                               <div class="card-comment">
                                                     <i class="far fa-comment"></i>
                                                     <p class="card-text">${comment}</p>
                                               </div>
                                               <div class="card-date-like">
                                                    <div class="date">
                                                        <span>${time}</span>
                                                   </div>
                                                   <div class="like">
                                                        <span>❤️</span>                         
<!--                                                       <span class="material-icons-outlined">favorite_border</span>-->
                                                   </div>
                                               </div>
                                               
                                               
                                              </div>
                                        </div>`
                        $('#cards-box').append(temp_html)
                        }}
                         if(cho2 == true){
                            if(artist.includes(search))
                        {
                            let temp_html = `<div class="col">
                                            <div class="card">
                                                 <a href="${url}" target="_blank"><img src=${image}
                                                  class="card-img-top"></a>
                                                  <i class="fas fa-times delete" onclick="done_music(${num})"></i>
                                            
                                               <div class="card-body">
                                                    <h5 class="card-title">${title}</h5>                
                                                    <p class="card-text">${artist}</p> 
                                               </div>
                                               <div class="card-comment">
                                                     <i class="far fa-comment"></i>
                                                     <p class="card-text">${comment}</p>
                                               </div>
                                               <div class="card-date-like">
                                                    <div class="date">
                                                        <span>${time}</span>
                                                   </div>
                                                   <div class="like">
                                                        <span>❤️</span>                         
<!--                                                       <span class="material-icons-outlined">favorite_border</span>-->
                                                   </div>
                                               </div>
                                               
                                               
                                              </div>
                                        </div>`
                        $('#cards-box').append(temp_html)
                        }
                    }
                    console.log(response['musics'])
                }
            },})
        }

    /* 포스팅 박스 열고 닫기*/
    function open_box() {
        $('#post-box').show()
    }

    function close_box() {
        $('#post-box').hide()
    }

    /* 로그아웃 */
    function logout2() {
        $.removeCookie('mytoken', {path: '/'});

        window.location.href = '/'
    }

