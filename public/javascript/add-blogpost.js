async function newFormHandler(event) {
    event.preventDefault();
  
    const title = document.querySelector('input[name="post-title"]').value;
    const summary = document.querySelector('input[name="post-summary"]').value;
  
    const response = await fetch(`/api/blogposts`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        summary,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
  
  document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);
  