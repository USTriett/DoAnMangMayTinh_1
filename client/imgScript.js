
function onSubmit(e) {
    e.preventDefault();
  
    document.querySelector('.msg').textContent = '';
    document.querySelector('#image').src = '';
  
    const prompt = document.querySelector('#prompt').value;
    const size = document.querySelector('#size').value;
  
    if (prompt === '') {
      alert('Please add some text');
      return;
    }
    document.querySelector('#prompt').value = "";
    generateImageRequest(prompt, size);
  }
  
  async function generateImageRequest(prompt, size) {
    try {  
      const response = await fetch('http://localhost:5000/img', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          size: size,
        })
      });
  
      if (!response.ok) {
        throw new Error('That image could not be generated');
      }
  
      const data = await response.json();
      // console.log(data);
  
      const imageUrl = data.data;
  
      document.querySelector('#image').src = imageUrl;
  
    } catch (error) {
      document.querySelector('.msg').textContent = error;
    }
  }
  
  
  document.querySelector('#image-form').addEventListener('submit', onSubmit);