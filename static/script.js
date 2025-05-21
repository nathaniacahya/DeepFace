function previewImage(input, previewId) {
  const preview = document.getElementById(previewId);
  
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    }
    
    reader.readAsDataURL(input.files[0]);
  }
}

async function upload() {
  const img1 = document.getElementById('img1').files[0];
  const img2 = document.getElementById('img2').files[0];

  if (!img1 || !img2) {
    alert("Please select two images.");
    return;
  }

  // Show loading indicator
  document.getElementById('loading').style.display = 'block';
  document.getElementById('result').innerText = 'Processing...';

  const formData = new FormData();
  formData.append('img1', img1);
  formData.append('img2', img2);

  try {
    const response = await fetch('/compare', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    // Hide loading indicator
    document.getElementById('loading').style.display = 'none';
    
    // Format the results nicely
    if (result.verified !== undefined) {
      let resultHTML = `<p><strong>Match: ${result.verified ? 'YES ✓' : 'NO ✗'}</strong></p>`;
      resultHTML += `<p>Similarity: ${(result.distance ? (1 - result.distance) * 100 : 0).toFixed(2)}%</p>`;
      resultHTML += `<p>Distance: ${result.distance ? result.distance.toFixed(4) : 'N/A'}</p>`;
      resultHTML += `<p>Threshold: ${result.threshold ? result.threshold.toFixed(4) : 'N/A'}</p>`;
      resultHTML += `<p>Model: ${result.model || 'N/A'}</p>`;
      
      document.getElementById('result').innerHTML = resultHTML;
    } else {
      document.getElementById('result').innerHTML = `<p>Error: ${result.error || 'Unknown error'}</p>`;
    }
  } catch (err) {
    // Hide loading indicator
    document.getElementById('loading').style.display = 'none';
    document.getElementById('result').innerText = 'Error: ' + err.message;
  }
}
