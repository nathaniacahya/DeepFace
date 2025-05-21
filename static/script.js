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

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.json();
    
    // Hide loading indicator
    document.getElementById('loading').style.display = 'none';
    
    console.log('Result:', result); // Debug log
    
    // Format the results nicely
    if (result.verified !== undefined) {
      const similarityPercent = (1 - parseFloat(result.distance)) * 100;
      let resultHTML = `<p><strong>Match: ${result.verified ? 'YES ✓' : 'NO ✗'}</strong></p>`;
      resultHTML += `<p>Similarity: ${similarityPercent.toFixed(2)}%</p>`;
      resultHTML += `<p>Distance: ${parseFloat(result.distance).toFixed(4)}</p>`;
      resultHTML += `<p>Threshold: ${parseFloat(result.threshold).toFixed(4)}</p>`;
      resultHTML += `<p>Model: ${result.model || 'VGG-Face'}</p>`;
      
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
