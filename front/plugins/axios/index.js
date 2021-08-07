export let axios;

export default ({ store, $axios, redirect }) => {
  $axios.defaults.baseURL = '/api/'
  $axios.onRequest(config => {
    config.headers.common['Accept'] = 'application/json';
  });
  $axios.onResponse(response => {
    return Promise.resolve(response);
  })
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 403) {
      redirect('/login')
    }
    return Promise.reject(error.response);
  });
  axios = $axios;
}
