classes = ["Boots", "Flip Flops", "Loafers", "Sandals", "Sneakers", "Soccer Shoes"];
var output;
let model;
(async () => {
  // document.querySelector("#loading_status").innerHTML = "⏳ Please wait . . . ";
  try {
    model = await tflite.loadTFLiteModel("shoes_lite.tflite");
    document.querySelector("#loading_status").innerHTML = "✅ Model is ready";
    document.querySelector("#get_img").disabled = false;
    
  } catch (e)  {
    document.querySelector("#loading_status").innerHTML = "❌ Can't load model";
    console.log("❌ Can't load model");
  }

})();


const getDeviceType = () => {
  const ua = navigator.userAgent;

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    console.log("mobile");
    document.querySelector("#target_img") . width = 150;
    return;
  }
  console.log("desktop");
  document.querySelector("#target_img") . width = 350;
  return;
};


async function set_img() {
  getDeviceType();
  document.querySelector("#predicted_type") . innerHTML = "";
  document.querySelector("html").style.background_image = URL.createObjectURL(document.querySelector("#get_img").files[0]);
  document.querySelector("#target_img").src = URL.createObjectURL(document.querySelector("#get_img").files[0]);
  document.querySelector("button").disabled = false;
  plot_chart([0,0,0,0,0,0]);
}

function predict_shoes() {
  
  img = document.getElementById("target_img");
  tensor = tf.browser.fromPixels(img);
  tensor = tf.image.resizeBilinear(tensor, [224, 224]);
  tensor = tensor.expandDims(0); 
  tensor = tensor.div(255.0);

  // const input = tf.randomNormal([1, 224, 224, 3]);
  output = model.predict(tensor);
  predicted = classes[output.dataSync().indexOf(Math.max(...output.dataSync()))];
  console.log(predicted);
  document.querySelector("#target_img").removeAttribute("height");
  document.querySelector("#predicted_type") . innerHTML = "Shoe Type: " + predicted + "<br>Confirmation: " + (Math.max(...output.dataSync()) * 100).toFixed(2) + "%";
  plot_chart([...output.dataSync()]);
}

function plot_chart(scores) {
  document.querySelector("#myChart") . height = 300;
  document.querySelector("#myChart") . width = 300;

  // const labels = Utils.months({count: 7});
const data = {
  labels: classes,
  datasets: [{
    label: 'Confirmation Score',
    data: scores,
    // fill: false,
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1
  }]
};

  config = {
  type: 'horizontalBar',
  data: data,
  options: {
    responsive: true,
  maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
        x: {
            beginAtZero: true
        }
    }
  }
};



  // var yValues = [55, 49, 44, 24, 15];
  new Chart("myChart", config);
}
