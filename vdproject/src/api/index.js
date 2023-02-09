import instance from './axios'

export default {
  getData: (file) => instance.get(file)
}
