fetch('url list.json')
  .then(response => response.json())
  .then(data => {
    // data is the JSON object
    displayData(data);
  });