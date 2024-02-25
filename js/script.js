
// добавление своего фото
document.getElementById('readUrl').addEventListener('change', function(){
    if (this.files[0] ) {
      var picture = new FileReader();
      picture.readAsDataURL(this.files[0]);
      picture.addEventListener('load', function(event) {
        document.getElementById('uploadedImage').setAttribute('src', event.target.result);
        document.getElementById('uploadedImage').style.display = 'block';
      });
    }
  });

//  отображение выбираемых цветов
  const partSelector = document.querySelector("#select_window_part_id");
  const selectedVariable = {
     name: partSelector.value
  };
  
  partSelector.addEventListener("change", (e) => {
     selectedVariable.name = e.target.value;
  });
  
  const hueBarState = {
     x: 0,
     y: 0
  };
  
  const colorBlock = document.getElementById("color_block");
  const ctx_colorBlock = colorBlock.getContext("2d");
  const colorBlockWidth = colorBlock.width;
  const colorBlockHeight = colorBlock.height;
  
  const hueBar = document.getElementById("hue_bar");
  const ctx_hueBar = hueBar.getContext("2d");
  const hueBarWidth = hueBar.width;
  const hueBarHeight = hueBar.height;
  
  const colorBlockState = {
     x: 0,
     y: 0
  };
  const colorPickerState = {
     drag: false,
     rgbaColor: "rgba(255,0,0,1)"
  };
  

  const windowColor = {
   "window_body": "0, 102, 204",
   "window_outline": "0, 120, 215"
      }

  ctx_colorBlock.rect(0, 0, colorBlockWidth, colorBlockHeight);
  fillColorBlockGradient();
  
  ctx_hueBar.rect(0, 0, hueBarWidth, hueBarHeight);
  const grd1 = ctx_hueBar.createLinearGradient(0, 0, 0, colorBlockHeight);
  grd1.addColorStop(0, "rgba(255, 0, 0, 1)");
  grd1.addColorStop(0.17, "rgba(255, 255, 0, 1)");
  grd1.addColorStop(0.34, "rgba(0, 255, 0, 1)");
  grd1.addColorStop(0.51, "rgba(0, 255, 255, 1)");
  grd1.addColorStop(0.68, "rgba(0, 0, 255, 1)");
  grd1.addColorStop(0.85, "rgba(255, 0, 255, 1)");
  grd1.addColorStop(1, "rgba(255, 0, 0, 1)");
  ctx_hueBar.fillStyle = grd1;
  ctx_hueBar.fill();
  

  function clickOnHueBar(e) {
     hueBarState.x = e.offsetX;
     hueBarState.y = e.offsetY;
     let imageData = ctx_hueBar.getImageData(hueBarState.x, hueBarState.y, 1, 1)
        .data;
     colorPickerState.rgbaColor =
        "rgba(" + imageData[0] + "," + imageData[1] + "," + imageData[2] + ",1)";
     fillColorBlockGradient();
     changeColorVariable();
  }
  
  function fillColorBlockGradient() {
     ctx_colorBlock.fillStyle = colorPickerState.rgbaColor;
     ctx_colorBlock.fillRect(0, 0, colorBlockWidth, colorBlockHeight);
  
     let grdWhite = ctx_hueBar.createLinearGradient(0, 0, colorBlockWidth, 0);
     grdWhite.addColorStop(0, "rgba(255,255,255,1)");
     grdWhite.addColorStop(1, "rgba(255,255,255,0)");
     ctx_colorBlock.fillStyle = grdWhite;
     ctx_colorBlock.fillRect(0, 0, colorBlockWidth, colorBlockHeight);
  
     let grdBlack = ctx_hueBar.createLinearGradient(0, 0, 0, colorBlockHeight);
     grdBlack.addColorStop(0, "rgba(0,0,0,0)");
     grdBlack.addColorStop(1, "rgba(0,0,0,1)");
     ctx_colorBlock.fillStyle = grdBlack;
     ctx_colorBlock.fillRect(0, 0, colorBlockWidth, colorBlockHeight);
  }
  
  function mousedownColorBlock(e) {
     e.preventDefault();
     colorPickerState.drag = true;
     changeColorVariable(e);
  }
  
  function mousemoveColorBlock(e) {
     if (colorPickerState.drag) {
        changeColorVariable(e);
     }
  }
  
  function mouseupColorBlock(e) {
     console.log("MOUSE UP: ");
     colorPickerState.drag = false;
  }
  
  function mouseoutColorBlock(e) {
     colorPickerState.drag = false;
  }
  
  function mousedownHueBar(e) {
     e.preventDefault();
     colorPickerState.drag = true;
     clickOnHueBar(e);
  }
  
  function mousemoveHueBar(e) {
     if (colorPickerState.drag) {
        clickOnHueBar(e);
     }
  }
  
  function mouseupHueBar(e) {
     colorPickerState.drag = false;
  }
  
  function mouseoutHueBar(e) {
     colorPickerState.drag = false;
  }
  
  function changeColorVariable(e) {
     if (e) {
        colorBlockState.x = e.offsetX;
        colorBlockState.y = e.offsetY;
     }
     let imageData = ctx_colorBlock.getImageData(
        colorBlockState.x,
        colorBlockState.y,
        1,
        1
     ).data;
   
     let alpha = 1

     if (selectedVariable.name == "window_body") {
         alpha = 0.3
     }

     colorPickerState.rgbaColor =
        "rgba(" + imageData[0] + "," + imageData[1] + "," + imageData[2] + "," + alpha + ")";
     const rootElement = document.querySelector(":root");
     rootElement.style.setProperty(
        `--${selectedVariable.name}`,
        colorPickerState.rgbaColor
     );

     windowColor[selectedVariable.name] = `${imageData[0]}, ${imageData[1]}, ${imageData[2]}`

  }

  function changeColorFromPreset(idPreset){
   const preset = document.getElementById(idPreset);
   const colorBody = "rgba" + window.getComputedStyle(preset).backgroundColor.slice(3,-1) + ", 0.3)";
   const colorBorder = window.getComputedStyle(preset).border.slice(12);
   const rootElement = document.querySelector(":root");
   rootElement.style.setProperty(
        `--window_body`,
        colorBody
     );
   rootElement.style.setProperty(
      `--window_outline`,
      colorBorder
   );
   
   windowColor["window_body"] = window.getComputedStyle(preset).backgroundColor.slice(4,-1);
   windowColor["window_outline"] = window.getComputedStyle(preset).border.slice(16,-1);
  }

  hueBar.addEventListener("mouseout", mouseoutHueBar, false); 
  hueBar.addEventListener("mousedown", mousedownHueBar, false);
  hueBar.addEventListener("mouseup", mouseupHueBar, false);
  hueBar.addEventListener("mousemove", mousemoveHueBar, false);
  
  colorBlock.addEventListener("mouseout", mouseoutColorBlock, false); 
  colorBlock.addEventListener("mousedown", mousedownColorBlock, false);
  colorBlock.addEventListener("mouseup", mouseupColorBlock, true);
  colorBlock.addEventListener("mousemove", mousemoveColorBlock, false);


// движение окна
const prev = { x: 0, y: 0 };
const rangeLimit = (v, a, b) => v > b ? b : (v < a ? a : v);
const savePosition = (e) => {
  prev.x = e.pageX;
  prev.y = e.pageY;
};

let window_container = document.getElementById('window_container');
let wallpaper = document.getElementById('wallpaper');
let drag = false;

window_container.style.position = 'absolute';


let range = {
  X: wallpaper.clientWidth  - window_container.offsetWidth,
  Y: wallpaper.clientHeight - window_container.offsetHeight,
};

window_container.onmousedown = function(e) {
  savePosition(e);
  drag = true;
};
document.onmouseup = function() {
  drag = false;
};
document.onmousemove = function(e) {
  if (drag) move(e);
};

function move(e) {

  let x = window_container.offsetLeft + (e.pageX - prev.x);
  let y = window_container.offsetTop  + (e.pageY - prev.y);

  x = rangeLimit(x, 0, range.X);
  y = rangeLimit(y, 0, range.Y);

  savePosition(e);
  reLoc(x, y);
}

function reLoc(x, y) {
   window_container.style.left = x + 'px';
   window_container.style.top  = y + 'px';
}

// генерация конфигурационного файла reg

function getCode() {
   let code = `Windows Registry Editor Version 5.00<br><br>

[HKEY_CURRENT_USER\Control Panel\Colors]<br>
"Hilight"="${windowColor["window_body"]}"<br><br>
   
[HKEY_CURRENT_USER\Control Panel\Colors]<br>
"HotTrackingColor"="${windowColor["window_outline"]}"
`
   document.getElementById('for_reg').innerHTML = code;

}


let openModalBtn = document.getElementById("to_get_the_code");
let modal = document.getElementById("getModal");
let closeModalBtn = document.getElementById("closeModalBtn");

openModalBtn.addEventListener("click", function() {
    modal.style.display = "block";
});

closeModalBtn.addEventListener("click", function() {
    modal.style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});


let questModalBtn = document.getElementById("question");
let questmodal = document.getElementById("questionModal");
let closeQuestBtn = document.getElementById("closeModalBtn2");

questModalBtn.addEventListener("click", function() {
   questmodal.style.display = "block";
});

closeQuestBtn.addEventListener("click", function() {
   questmodal.style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target === questmodal) {
      questmodal.style.display = "none";
    }
});