classes = ["Boots", "Flip Flops", "Loafers", "Sandals", "Sneakers", "Soccer Shoes"];
var output;
let model;
(async () => {
  // document.querySelector("#loading_status").innerHTML = "⏳ Please wait . . . ";
  try {
    model = await tflite.loadTFLiteModel("shoes_lite.tflite");
    document.querySelector("#loading_status").innerHTML = "✅ Model loaded";
  } catch (e)  {
    document.querySelector("#loading_status").innerHTML = "❌ Can't load model";
    console.log("❌ Can't load model");
  }

})();

async function set_img() {
  document.querySelector("#target_img").src = URL.createObjectURL(document.querySelector("#get_img").files[0]);
  // predict_shoes();
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
}