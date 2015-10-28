module.exports = {
 sanitizeForm : function(array){
  for (var i = 0; i < array.length; i++){
    array[i] = String(array[i]).replace(/<script\b[^>]*>(.*?)<\/script>/i, '').trim();
  }
  return array;
	}
}