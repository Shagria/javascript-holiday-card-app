$(document).ready(function(){
    picture_number = 1;
    designs = ["first","second","third","fourth"];
    design_num = 1;
    folder_name = "";
    text_number = 0;
    $(".submit").click(function(){
        picture_number = 1;
        typ_i = $("[type='radio']:checked").val();
        nadpis_i = $(".nadpis").val();
        text_i = $(".text").val();
        preText = $("#pre-generated:checked").length;

        nadpis = $("#card-h2");
        text = $("#card-p");

        if(typ_i == 1){
            folder_name = "christmas";
        }
        else if(typ_i == 2){
            folder_name = "birthday";
        }
        else if(typ_i == 3){
            folder_name = "PF";
        }
        else{
            alert("Nezadali jste typ přání!");
            exit;
        }

        if(preText == 0){
            text.html(text_i);
            nadpis.html(nadpis_i);
            imgSource = `../pictures/${folder_name}/obrazek-${picture_number}.jpg`;
            $(".picture-container").css("background-image","url("+ imgSource +")");
        }
        else if(preText ==1 && text_i.length == 0){
            text_number = 0;
            call_json(text_number);
            nadpis.html(nadpis_i);
            imgSource = `../pictures/${folder_name}/obrazek-${picture_number}.jpg`;
            $(".picture-container").css("background-image","url("+ imgSource +")");
        }else{
            alert("Pro předdefinovaný text musíte mít prázné pole s vlastním textem.")
        }
    });
    $(".change-design").click(function(){
        if(folder_name != ""){
            $(".picture-container").addClass(designs[design_num]);
            $(".picture-container").removeClass(designs[design_num-1]);
            if(design_num == designs.length){
                design_num = 0;
                $(".picture-container").addClass(designs[design_num]);
            }
            else{
                design_num++;
            }
        }
        else{
            alert("Nejdříve potvrďte vaše parametry!");
        }
    });
    $(".back").click(function(){
        if(folder_name != ""){
            if(folder_name == "birthday"){
                all_img_num = 3;
            }
            else{
                all_img_num = 5;
            }
            if(picture_number == 1){
                picture_number = all_img_num;
            }
            else{
                picture_number--;
            }
            imgSource = `../pictures/${folder_name}/obrazek-${picture_number}.jpg`;

            $(".picture-container").css("background-image","url("+ imgSource +")");
        }
        else{
            alert("Nejdříve potvrďte vaše parametry!");
        }
    });
    $(".forward").click(function(){
        if(folder_name != ""){
        if(folder_name == "birthday"){
            all_img_num = 3;
        }
        else{
            all_img_num = 5;
        }

        if(picture_number == all_img_num){
            picture_number = 1;
        }
        else{
            picture_number++;
        }

        imgSource = `../pictures/${folder_name}/obrazek-${picture_number}.jpg`;
        $(".picture-container").css("background-image","url("+ imgSource +")");}
        else{
            alert("Nejdříve potvrďte vaše parametry!");
        }
    });
    $(".share").click(() => {
        html2canvas(document.querySelector("#capture")).then(canvas => {
            /*link = "";*/
            canvas.toBlob(file =  function(blob){
                /*link.href = URL.createObjectURL(blob);*/
                file = blob;
                file = new File([blob],"image.png",{type: blob.type});
                async function share(){
                if(navigator.share){
                    try{
                        await navigator.share({
                            title: "Přání",
                            text:"Posílám přání!",
                            url:"https://esotemp.vse.cz/~cham20/javascript_app/html/",
                            files: [file]
                        });
                        console.log("Sdílení se podařilo.");
                    } catch (err) {
                    console.error("Sdílení selhalo:", err.message);
                    }
                }else{
                    alert("Nemáte funkci sdílení ve vašem prohlížeči");
                };
                };
                share();                
            },'image/png');
        });
    });
    $(".change-text").click(() => {
        if(text_number < 5){
            text_number++;
            call_json(text_number);
        }
        else{
            text_number = 0;
            call_json(text_number);
        }
    });
    function call_json(text_number){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                pf_text = JSON.parse(xhr.responseText);
                current_text = pf_text.texts[text_number];
                $("#card-p").html(current_text);
            }
        };
        xhr.open("GET", "../json/texts.json", true);
        xhr.send();
    }
});