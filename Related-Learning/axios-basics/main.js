// AXIOS GLOBALS

// This is a way of setting the default headers value, this is a token value below.
axios.defaults.headers.common['X-Auth-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';


// GET REQUEST
function getTodos() {
  axios
      .get('https://jsonplaceholder.typicode.com/todos?_limit=5', {timeout: 5000 }) // Timeout after 5 seconds, this stops the request after 5 seconds.
      .then(res => showOutput(res))
      .catch(err => console.error(err));

    //, { params: { _limit: 5 } -- This is another way to do it. 



  // This is the getter function that doesn't use the axios library.
    // axios({
    //     method: 'get',
    //     url: 'https://jsonplaceholder.typicode.com/todos', // This returns a promise, so we're going to add a .then to it.
    //     params: { // This params {_limit: 5} is a way to limit the number of data entries returned to us, we can also add it on to the end of the URL 'URL...todos?_limit=5'
    //       _limit: 5
    //     }
    // })
    //     .then(res => showOutput(res))
    //     .catch(err => console.error(err));
}
  
  
  // POST REQUEST
  function addTodo() {
    axios.post('https://jsonplaceholder.typicode.com/todos', {
      title: 'New Todo',
      completed: false
    })
        .then(res => showOutput(res))
        .catch(err => console.error(err));
  }
  
  // PUT/PATCH REQUEST 
  // Put is used to update the entire resource, whereas patch is used to update it incrementally.
  function updateTodo() {
    axios
      .put('https://jsonplaceholder.typicode.com/todos/1', {
      title: 'Updated Todo',
      completed: true
      })
      .then(res => showOutput(res))
      .catch(err => console.error(err));
  }
  
  // DELETE REQUEST
  function removeTodo() {
    axios
      .delete('https://jsonplaceholder.typicode.com/todos/1')
      .then(res => showOutput(res))
      .catch(err => console.error(err));
  }

  
  // SIMULTANEOUS DATA
  function getData() { // axios.all helps us make multiple requests at the same time.
    axios.all([
      axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'), // These are fulfilled then these below
      axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
    ])
      .then(axios.spread((todos, posts) => showOutput(posts))) // instead of console.logging these requests, we use axios.spread that helps us name the data, then showOutput displays for our viewing.
      .catch(err => console.error(err));
  }
  
  // CUSTOM HEADERS
  function customHeaders() { 
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'someToken'
      }
    }

    axios.post('https://jsonplaceholder.typicode.com/todos', {
      title: 'New Todo',
      completed: false
    }, config
    )
        .then(res => showOutput(res))
        .catch(err => console.error(err));
  }
  
  
  // TRANSFORMING REQUESTS & RESPONSES
  function transformResponse() { // This function demonstrates how to modify data.
    const options = {
      method: 'post',
      url: 'https://jsonplaceholder.typicode.com/todos',
      data: {
        title: 'Hello World'
      },
      transformResponse: axios.defaults.transformResponse.concat(data => {
        data.title = data.title.toUpperCase();
        return data;
      })
    }

    axios(options).then(res => showOutput(res)); // showOutput of Resolution.
  }
  
  // ERROR HANDLING
  function errorHandling() {
    axios
    .get('https://jsonplaceholder.typicode.com/todoss', {
      validateStatus: function(status) {
        return status < 500; // Reject only if status is greater than or equal to.
      }
    }) 
    .then(res => showOutput(res))
    .catch(err => {
      if (err.response) {
        // Server responded with a status other than the 200 range.
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);

        if(err.response.status === 404) {
          alert('Error: Page Not Found');
        }
      } else if (err.request) {
        // Request was made but no response
        console.error(err.request);
      } else { 
        // Anything else, print the error message.
        console.error(err.message);
      }
    });
  }
  
  // CANCEL TOKEN
  function cancelToken() {
    const source = axios.CancelToken.source();
    
    
    axios
    .get('https://jsonplaceholder.typicode.com/todos', {
      cancelToken: source.token
    }) 
    .then(res => showOutput(res))
    .catch(thrown => {
      if(axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      }
    });
    
    if(true) {
      source.cancel('Request canceled.');
    }
  }
  
  // INTERCEPTING REQUESTS & RESPONSES 
  // Interceptor.

  axios.interceptors.request.use(config => { // This is an interceptor that console.logs a message that states the method that was used called to URL at time, this will log every time a request is made.
    console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`)

    return config
  },error => {
    return Promise.reject(error);
  })
  
  // AXIOS INSTANCES
  const axiosInstance = axios.create({
    // Outer custom settings.
    baseURL: 'https://jsonplaceholder.typicode.com'
  });

  axiosInstance.get('/comments').then(res => showOutput(res));
  
  // Show output in browser
  function showOutput(res) { // This takes the response object and displays it for our use.
    document.getElementById('res').innerHTML = ` 
    <div class="card card-body mb-4">
      <h5>Status: ${res.status}</h5>
    </div>
    <div class="card mt-3">
      <div class="card-header">
        Headers
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.headers, null, 2)}</pre>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header">
        Data
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.data, null, 2)}</pre>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header">
        Config
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.config, null, 2)}</pre>
      </div>
    </div>
  `;
  }
  
  // Event listeners
  document.getElementById('get').addEventListener('click', getTodos);
  document.getElementById('post').addEventListener('click', addTodo);
  document.getElementById('update').addEventListener('click', updateTodo);
  document.getElementById('delete').addEventListener('click', removeTodo);
  document.getElementById('sim').addEventListener('click', getData);
  document.getElementById('headers').addEventListener('click', customHeaders);
  document
    .getElementById('transform')
    .addEventListener('click', transformResponse);
  document.getElementById('error').addEventListener('click', errorHandling);
  document.getElementById('cancel').addEventListener('click', cancelToken);
  